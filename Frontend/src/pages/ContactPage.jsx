import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import MarketingLayout from "../components/MarketingLayout";

export default function ContactPage() {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 lg:p-10">
          <p className="text-sm font-medium text-blue-600">Contact us</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">Set up clear contact paths before you launch publicly.</h1>
          <p className="mt-5 max-w-4xl text-base leading-7 text-gray-600 md:text-lg">
            This page gives your hosted product a proper public contact surface. Replace the placeholder email below
            with your real support or business address before deployment.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_420px]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <ContactCard
                icon={<Mail size={20} />}
                title="Support email"
                content="hello@yourdomain.com"
                description="Replace this placeholder with your live support inbox before hosting."
              />
              <ContactCard
                icon={<ShieldCheck size={20} />}
                title="Deployment help"
                content="Set FRONTEND and BACKEND env values"
                description="Use environment variables for API URL, CORS origins, and cookie settings."
              />
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-medium text-blue-600">Next actions</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">Open the platform and start testing the public flow.</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/singup" className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
                Create account
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
                Login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}

const ContactCard = ({ icon, title, content, description }) => (
  <div className="rounded-3xl border border-gray-200 bg-[#f5f5f3] p-5">
    <div className="inline-flex rounded-2xl bg-white p-3 text-blue-600 shadow-sm">{icon}</div>
    <h2 className="mt-4 text-lg font-semibold text-gray-900">{title}</h2>
    <p className="mt-2 text-sm font-medium text-gray-900">{content}</p>
    <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
  </div>
);