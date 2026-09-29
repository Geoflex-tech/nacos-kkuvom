import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

/**
 * useLeadership — shared data layer for all leadership components.
 *
 * Returns all 13 canonical positions.
 * Any position not yet filled in the DB is returned as status="vacant".
 * No names, bios, or socials are hardcoded here — they come from the DB only.
 *
 * Works in two DB-schema modes automatically:
 *  A) MIGRATED  — executives table has rank/tier/status/slug columns.
 *  B) PRE-MIGRATION — executives table has old columns only.
 *                     All positions are returned as vacant until migration runs.
 */

/* ── Canonical 13 positions — position metadata only, NO person data ── */
const CANONICAL = [
  { rank: 1,  tier: "executive",  position: "President",                      slug: "president"              },
  { rank: 2,  tier: "executive",  position: "Vice President",                 slug: "vice-president"         },
  { rank: 3,  tier: "executive",  position: "Secretary-General",              slug: "secretary-general"      },
  { rank: 4,  tier: "executive",  position: "Assistant Secretary-General",    slug: "asst-secretary-general" },
  { rank: 5,  tier: "executive",  position: "Financial Secretary",            slug: "financial-secretary"    },
  { rank: 6,  tier: "executive",  position: "Treasurer",                      slug: "treasurer"              },
  { rank: 7,  tier: "executive",  position: "Public Relations Officer (PRO)", slug: "pro"                    },
  { rank: 8,  tier: "directors",  position: "Director of Software",           slug: "director-of-software"   },
  { rank: 9,  tier: "directors",  position: "Director of Hardware",           slug: "director-of-hardware"   },
  { rank: 10, tier: "directors",  position: "Director of Welfare",            slug: "director-of-welfare"    },
  { rank: 11, tier: "directors",  position: "Director of Socials",            slug: "director-of-socials"    },
  { rank: 12, tier: "directors",  position: "Director of Sports",             slug: "director-of-sports"     },
  { rank: 13, tier: "discipline", position: "Provost",                        slug: "provost"                },
];

/* Build a fully-vacant list (used when no DB data available) */
function buildAllVacant() {
  return CANONICAL.map((c) => ({
    id:           `vacant-${c.rank}`,
    name:         null,
    position:     c.position,
    rank:         c.rank,
    tier:         c.tier,
    slug:         c.slug,
    status:       "vacant",
    level:        null,
    department:   null,
    bio:          null,
    social_links: null,
    image_url:    null,
    email:        null,
    phone:        null,
  }));
}

/* Normalise position strings for matching (handles old DB typos) */
const normalise = (s = "") =>
  s.toLowerCase()
   .replace(/tresurer/, "treasurer")
   .replace(/software\s+director/, "director of software")
   .trim();

/* Detect whether the migrated columns exist */
function isMigratedSchema(rows) {
  if (!rows || rows.length === 0) return false;
  return Object.prototype.hasOwnProperty.call(rows[0], "tier");
}

/* Merge migrated DB rows against canonical — vacant for any missing position */
function buildFromMigratedRows(dbRows) {
  return CANONICAL.map((canon) => {
    const match = (dbRows || []).find(
      (r) => normalise(r.position) === normalise(canon.position) ||
             r.slug === canon.slug ||
             r.rank === canon.rank
    );
    if (match && match.status === "filled" && match.name) {
      return {
        ...match,
        rank:     match.rank     ?? canon.rank,
        tier:     match.tier     ?? canon.tier,
        slug:     match.slug     ?? canon.slug,
        position: canon.position, // always use canonical title (correct spelling)
      };
    }
    // vacant placeholder — use canonical position title (correct spelling)
    return {
      id:           match?.id    || `vacant-${canon.rank}`,
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

    /* 1. Get current administration */
    const { data: admin } = await supabase
      .from("administrations")
      .select("id")
      .eq("is_current", true)
      .maybeSingle();

    if (!admin) {
      // No current administration — all positions vacant
      setLeaders(buildAllVacant());
      setLoading(false);
      return;
    }

    /* 2. Try fetching with migrated columns */
    const { data: migratedData, error: migratedErr } = await supabase
      .from("executives")
      .select(
        "id,name,position,rank,tier,status,slug,level,department,bio,social_links,image_url,email,phone"
      )
      .eq("administration_id", admin.id)
      .order("rank", { ascending: true });

    if (!migratedErr && isMigratedSchema(migratedData)) {
      setLeaders(buildFromMigratedRows(migratedData));
      setLoading(false);
      return;
    }

    /* 3. PRE-MIGRATION: old schema — return all vacant (no person data to show) */
    console.info("[useLeadership] Pre-migration schema detected. Run 0009_leadership.sql to enable full leadership data.");
    setLeaders(buildAllVacant());
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

  /* Derived */
  const filled  = leaders.filter((l) => l.status === "filled" && l.name);
  const vacant  = leaders.filter((l) => l.status !== "filled" || !l.name);
  const total   = CANONICAL.length; // always 13

  const byTier = {
    executive:  leaders.filter((l) => l.tier === "executive"),
    directors:  leaders.filter((l) => l.tier === "directors"),
    discipline: leaders.filter((l) => l.tier === "discipline"),
  };

  return { leaders, filled, vacant, total, byTier, loading, error, retry: load };
}
