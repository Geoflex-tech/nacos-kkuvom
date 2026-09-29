/**
 * Leadership page — /leadership
 *
 * "Coming Soon" state — leadership positions are not yet announced.
 * The data-driven grid and BioDialog remain in the codebase and can be
 * restored by swapping this file back once positions are filled.
 */
import { Users } from "lucide-react";
import PageHeader from "../../components/PageHeader";

export default function Leadership() {
  return (
    <>
      <PageHeader
        label="Leadership"
        titleBold="MEET THE"
        titleLight="PIONEER TEAM"
        description="The elected officers and directors serving NACOS KKU VOM Chapter."
      />

      <section className="lp-wrap" aria-label="Leadership coming soon">
        <div className="lp-container">

          <div className="lp-coming-soon">
            <div className="lp-icon-wrap" aria-hidden="true">
              <Users size={40} />
            </div>
            <h2 className="lp-title">Leadership Positions Coming Soon</h2>
            <p className="lp-desc">
              Our executive team and directors are being announced shortly.
              Check back here for the full pioneer administration lineup.
            </p>
          </div>

        </div>
      </section>

      <style>{`
        .lp-wrap {
          background: #F4F7FB;
          padding-top: 72px;
          padding-bottom: 96px;
          min-height: 50vh;
          display: flex;
          align-items: center;
        }
        .lp-container {
          max-width: 640px;
          margin-inline: auto;
          padding-inline: 24px;
          width: 100%;
        }
        .lp-coming-soon {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 56px 40px;
          text-align: center;
          box-shadow: 0 4px 24px rgba(30,64,175,0.06);
        }
        .lp-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #EEF2FF;
          color: #1E40AF;
          margin-bottom: 24px;
        }
        .lp-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 12px;
        }
        .lp-desc {
          font-size: 0.9375rem;
          color: #64748B;
          line-height: 1.7;
          margin: 0;
          max-width: 420px;
          margin-inline: auto;
        }

        @media (max-width: 639px) {
          .lp-coming-soon {
            padding: 40px 24px;
          }
          .lp-title { font-size: 1.2rem; }
        }
      `}</style>
    </>
  );
}
