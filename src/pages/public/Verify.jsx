import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Verify() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [notFound, setNotFound] = useState(false);

  const verify = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setResult(null);
    setNotFound(false);

    const cleanCode = code.trim().toUpperCase();

    const { data, error } = await supabase.rpc("verify_certificate", {
      code: cleanCode,
    });

    if (error) {
      setStatus("done");
      setNotFound(true);
      return;
    }

    if (!data || data.length === 0) {
      setStatus("done");
      setNotFound(true);
    } else {
      setResult(data[0]);
      setStatus("done");
    }
  };

  const reset = () => {
    setCode("");
    setResult(null);
    setStatus("idle");
    setNotFound(false);
  };

  return (
    <>
      <section className="bg-gradient-to-br from-nacos-blue to-nacos-green text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-extrabold mb-3">
            Certificate Verification
          </h1>
          <p className="text-white/85 text-lg">
            Verify the authenticity of any certificate issued by
            NACOS KKU Vom Chapter.
          </p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 py-12">
        <form onSubmit={verify} className="card p-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Enter certificate number
          </label>
          <input
            className="input font-mono"
            placeholder="NACOS-KKU-2026-000001"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary w-full"
          >
            {status === "loading" ? "Verifying..." : "Verify Certificate"}
          </button>
          <p className="text-xs text-gray-500 text-center">
            The certificate number is printed on the certificate document.
          </p>
        </form>

        {status === "done" && notFound && (
          <div className="card p-6 mt-6 border-l-4 border-red-500">
            <div className="flex items-start gap-3">
              <div className="text-3xl">❌</div>
              <div>
                <h2 className="text-xl font-bold text-red-600 mb-1">
                  Not Verified
                </h2>
                <p className="text-gray-700">
                  No certificate matches that number. It may have been revoked
                  or never existed.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  If you believe this is an error, please contact the chapter
                  at{" "}
                  <a
                    href="mailto:nacoskkuvom@gmail.com"
                    className="text-nacos-green hover:underline"
                  >
                    nacoskkuvom@gmail.com
                  </a>
                  .
                </p>
                <button onClick={reset} className="btn-outline mt-4 text-sm">
                  Try another code
                </button>
              </div>
            </div>
          </div>
        )}

        {status === "done" && result && (
          <div className="card p-6 mt-6 border-l-4 border-green-500">
            <div className="flex items-start gap-3">
              <div className="text-3xl">
                {result.status === "valid" ? "✅" : "⚠️"}
              </div>
              <div className="flex-1">
                <h2
                  className={`text-xl font-bold mb-1 ${
                    result.status === "valid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {result.status === "valid"
                    ? "Certificate Verified"
                    : "Certificate Revoked"}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Issued by NACOS KKU Vom Chapter
                </p>

                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs text-gray-500 uppercase tracking-wide">
                      Recipient
                    </dt>
                    <dd className="font-semibold text-nacos-blue text-lg">
                      {result.recipient_name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 uppercase tracking-wide">
                      Certificate
                    </dt>
                    <dd className="font-medium text-gray-800">
                      {result.title}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-xs text-gray-500 uppercase tracking-wide">
                        Certificate No.
                      </dt>
                      <dd className="font-mono text-sm text-gray-700">
                        {result.certificate_number}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 uppercase tracking-wide">
                        Date Issued
                      </dt>
                      <dd className="text-sm text-gray-700">
                        {new Date(result.issued_date).toDateString()}
                      </dd>
                    </div>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 uppercase tracking-wide">
                      Signed By
                    </dt>
                    <dd className="text-sm text-gray-700">
                      {result.signed_by}
                    </dd>
                  </div>
                </dl>

                {result.status === "valid" && (
                  <p className="text-xs text-gray-500 mt-4 pt-4 border-t">
                    This certificate is authentic and was issued by
                    NACOS KKU Vom Chapter.
                  </p>
                )}

                {result.status === "revoked" && (
                  <p className="text-xs text-yellow-700 mt-4 pt-4 border-t">
                    This certificate has been revoked by the issuing chapter
                    and is no longer valid.
                  </p>
                )}

                <button onClick={reset} className="btn-outline mt-4 text-sm">
                  Verify another
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}