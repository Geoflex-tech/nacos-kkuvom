import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function CertificateView() {
  const { id } = useParams();
  const { session, hasPermission } = useAuth();
  const [cert, setCert] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase
        .from("certificates")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!c) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const isOwner = c.member_id === session?.user?.id;
      const isIssuer = hasPermission("certificates.issue");

      if (!isOwner && !isIssuer) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data: m } = await supabase
        .from("profiles")
        .select("full_name, email, matric_no, level")
        .eq("id", c.member_id)
        .maybeSingle();

      setCert(c);
      setMember(m);
      setLoading(false);
    })();
  }, [id, session, hasPermission]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading certificate...
      </div>
    );
  }

  if (notFound) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-nacos-blue mb-4">
          Certificate not found
        </h1>
        <Link to="/certificates" className="btn-primary inline-block">
          Back to My Certificates
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          to="/certificates"
          className="text-sm text-nacos-green font-semibold hover:underline"
        >
          ← Back to My Certificates
        </Link>
        <button
          onClick={() => window.print()}
          className="btn-primary text-sm"
        >
          🖨️ Print / Save as PDF
        </button>
      </div>

      {/* Certificate */}
      <div className="bg-white border-4 border-nacos-gold rounded-lg shadow-lg p-8 md:p-12 relative overflow-hidden print:shadow-none print:border-2">
        {/* Decorative corner marks */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-nacos-blue" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-nacos-blue" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-nacos-blue" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-nacos-blue" />

        <div className="text-center">
          {/* Logos — equal height, vertically centered */}
          <div className="flex items-center justify-center gap-8 md:gap-14 mb-5">
            <div className="h-24 w-24 md:h-28 md:w-28 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="NACOS KKU VOM"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="h-24 w-24 md:h-28 md:w-28 flex items-center justify-center">
              <img
                src="/kku-logo.jpeg"
                alt="Karl Kumm University"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          <p className="text-sm uppercase tracking-[0.2em] text-gray-600 font-semibold">
            Nigeria Association of Computing Students
          </p>
          <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
            Karl Kumm University, Vom Chapter
          </p>

          {/* Certificate title */}
          <div className="my-8">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">
              Certificate of
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-nacos-blue">
              {cert.title}
            </h1>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            This certificate is proudly presented to
          </p>

          <p className="text-2xl md:text-3xl font-bold text-nacos-green mb-4 border-b-2 border-nacos-gold inline-block pb-1 px-6">
            {member?.full_name || "Recipient"}
          </p>

          {member?.matric_no && (
            <p className="text-xs text-gray-500 mb-6">
              Matric No: {member.matric_no}
              {member.level ? ` · ${member.level}` : ""}
            </p>
          )}

          {cert.description && (
            <p className="text-gray-700 max-w-xl mx-auto mb-8 leading-relaxed">
              {cert.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto mt-10 pt-6 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Date Issued
              </p>
              <p className="font-semibold text-nacos-blue">
                {new Date(cert.issued_date).toDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Certificate No.
              </p>
              <p className="font-mono text-xs text-gray-700">
                {cert.certificate_number}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="font-signature text-2xl text-nacos-blue italic mb-1">
              {cert.signed_by}
            </p>
            <div className="w-48 mx-auto border-t border-gray-400" />
            <p className="text-xs text-gray-500 mt-1">Authorized Signature</p>
          </div>

          {cert.status === "revoked" && (
            <div className="mt-8 inline-block bg-red-100 text-red-700 text-xs font-bold px-4 py-2 rounded">
              ⚠️ THIS CERTIFICATE HAS BEEN REVOKED
            </div>
          )}

          <p className="text-[10px] text-gray-400 mt-8">
            Verify authenticity at{" "}
            <span className="font-mono">
              nacos-kkuvom.vercel.app/verify
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
