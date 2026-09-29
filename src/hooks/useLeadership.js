import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

/**
 * useLeadership — shared data layer for all leadership components.
 *
 * Works in TWO modes automatically:
 *  A) MIGRATED  — executives table has rank/tier/status/slug columns.
 *                 Returns all 13 positions (filled + vacant) from DB.
 *  B) PRE-MIGRATION — executives table only has old columns.
 *                 Builds the full 13-position list by merging the existing
 *                 3 rows with a hardcoded canonical position list so the
 *                 page never shows blank.
 *
 * The canonical position list is the single source of truth for rank,
 * tier, and slug — the DB values override it after migration.
 */

/* ── Canonical 13 positions ─────────────────────────────────── */
const CANONICAL = [
  {
    rank: 1,  tier: "executive",  position: "President", slug: "president",
    bio: "Full-stack developer and backend lead for the NACOS KKU VOM Chapter Portal.",
    social_links: { github: "https://github.com/Geoflex-tech" },
  },
  { rank: 2,  tier: "executive",  position: "Vice President",                 slug: "vice-president"      },
  { rank: 3,  tier: "executive",  position: "Secretary-General",              slug: "secretary-general"   },
  { rank: 4,  tier: "executive",  position: "Assistant Secretary-General",    slug: "asst-secretary-general" },
  { rank: 5,  tier: "executive",  position: "Financial Secretary",            slug: "financial-secretary" },
  { rank: 6,  tier: "executive",  position: "Treasurer",                      slug: "treasurer"           },
  { rank: 7,  tier: "executive",  position: "Public Relations Officer (PRO)", slug: "pro"                 },
  {
    rank: 8,  tier: "directors",  position: "Director of Software", slug: "director-of-software",
    bio: "Software Engineer and Agentic AI Engineer with 6+ years of experience building innovative software solutions. Works as an Agentic Engineer at Gean Lab and a Software Engineer at Blockfuse Labs. Passionate about AI, Blockchain, and open-source technology, building with Python, JavaScript, TypeScript, Node.js, React.js, and Next.js.",
    social_links: { portfolio: "https://devscholar00.netlify.app" },
  },
  { rank: 9,  tier: "directors",  position: "Director of Hardware",           slug: "director-of-hardware"},
  { rank: 10, tier: "directors",  position: "Director of Welfare",            slug: "director-of-welfare" },
  { rank: 11, tier: "directors",  position: "Director of Socials",            slug: "director-of-socials" },
  { rank: 12, tier: "directors",  position: "Director of Sports",             slug: "director-of-sports"  },
  { rank: 13, tier: "discipline", position: "Provost",                        slug: "provost"             },
];

/* Normalise position strings for matching (handles old typos too) */
const normalise = (s = "") =>
  s.toLowerCase()
   .replace(/tresurer/,   "treasurer")
   .replace(/software\s+director/, "director of software")
   .trim();

const matchCanonical = (position) =>
  CANONICAL.find((c) => normalise(c.position) === normalise(position));

/**
 * Detect whether the migrated columns exist.
 * We check by seeing if any row has a non-null `tier` value.
 * If the column doesn't exist, the REST API returns an error.
 */
function isMigratedSchema(rows) {
  // If at least one row has the `tier` key (even if null), schema is migrated
  if (!rows || rows.length === 0) return false;
  return Object.prototype.hasOwnProperty.call(rows[0], "tier");
}

/* ── Merge old rows into canonical list ─────────────────────── */
function buildLeadersFromOldSchema(dbRows) {
  return CANONICAL.map((canon) => {
    const match = dbRows.find(
      (r) => normalise(r.position) === normalise(canon.position)
    );
    if (match) {
      return {
        ...match,
        // Inject canonical metadata that doesn't exist in DB yet
        rank:         canon.rank,
        tier:         canon.tier,
        slug:         canon.slug,
        status:       "filled",
        // Use DB bio/social_links if set, otherwise fall back to canonical
        bio:          match.bio          || canon.bio          || null,
        department:   match.department   || null,
        social_links: match.social_links || canon.social_links || null,
      };
    }
    // Vacant placeholder
    return {
      id:           `vacant-${canon.rank}`,
      name:         null,
      position:     canon.position,
      rank:         canon.rank,
      tier:         canon.tier,
      slug:         canon.slug,
      status:       "vacant",
      level:        null,
      department:   null,
      bio:          null,
      social_links: null,
      image_url:    null,
      email:        null,
      phone:        null,
    };
  });
}

/* ══════════════════════════════════════════════════════════════ */
export function useLeadership() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    setError(null);

    /* ── 1. Get current administration ── */
    const { data: admin } = await supabase
      .from("administrations")
      .select("id")
      .eq("is_current", true)
      .maybeSingle();

    if (!admin) {
      // No current administration — still show canonical vacant list
      setLeaders(buildLeadersFromOldSchema([]));
      setLoading(false);
      return;
    }

    /* ── 2. Try fetching with migrated columns first ── */
    const { data: migratedData, error: migratedErr } = await supabase
      .from("executives")
      .select(
        "id,name,position,rank,tier,status,slug,level,department,bio,social_links,image_url,email,phone"
      )
      .eq("administration_id", admin.id)
      .order("rank", { ascending: true });

    if (!migratedErr && isMigratedSchema(migratedData)) {
      /* ── MIGRATED PATH: sort by rank, fill missing rank from canonical ── */
      const withCanon = (migratedData || []).map((row) => {
        if (row.rank && row.tier) return row;
        // row exists but rank/tier still null — fill from canonical
        const canon = matchCanonical(row.position);
        return {
          ...row,
          rank:   row.rank   ?? canon?.rank   ?? 99,
          tier:   row.tier   ?? canon?.tier   ?? "executive",
          slug:   row.slug   ?? canon?.slug   ?? null,
          status: row.status ?? "filled",
        };
      });
      withCanon.sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
      setLeaders(withCanon);
      setLoading(false);
      return;
    }

    /* ── 3. PRE-MIGRATION PATH: fetch with old columns only ── */
    const { data: oldData, error: oldErr } = await supabase
      .from("executives")
      .select("id,name,position,level,image_url,email,phone,order_index")
      .eq("administration_id", admin.id)
      .order("order_index", { ascending: true });

    if (oldErr) {
      setError(oldErr.message);
      setLoading(false);
      return;
    }

    setLeaders(buildLeadersFromOldSchema(oldData || []));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();

    const channel = supabase
      .channel("leadership-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "executives" },
        () => { load(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [load]);

  /* ── Derived values ── */
  const filled  = leaders.filter((l) => l.status === "filled");
  const vacant  = leaders.filter((l) => l.status === "vacant");
  const total   = leaders.length;

  const byTier = {
    executive:  leaders.filter((l) => l.tier === "executive"),
    directors:  leaders.filter((l) => l.tier === "directors"),
    discipline: leaders.filter((l) => l.tier === "discipline"),
  };

  return { leaders, filled, vacant, total, byTier, loading, error, retry: load };
}
