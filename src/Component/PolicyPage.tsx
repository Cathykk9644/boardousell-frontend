import { DISCLAIMER } from "../constant";

export default function PolicyPage() {
  return (
    <div className="flex flex-col items-center">
      {DISCLAIMER}
      <h1>
        <b>User Responsibilities:</b>
      </h1>
      <ul className="list-disc w-5/6">
        <li>
          Users are responsible for providing accurate and up-to-date
          information.
        </li>
        <li>Users must comply with all applicable laws and regulations.</li>
        <li>
          Users are responsible for maintaining the security and confidentiality
          of their account credentials.
        </li>
      </ul>
      <h1>
        <b>Prohibited Activities:</b>
      </h1>
      <ul className="list-disc w-5/6">
        <li>
          Users must not engage in fraudulent, illegal, or deceptive activities.
        </li>
        <li>
          Users are prohibited from listing or selling restricted or prohibited
          items.
        </li>
        <li>Users must not infringe upon intellectual property rights.</li>
      </ul>
      <h1>
        <b>Item Listings:</b>
      </h1>
      <ul className="list-disc w-5/6">
        <li>
          Users must provide accurate and detailed information about the items
          they list.
        </li>
        <li>
          Users must upload high-quality photos that accurately represent the
          listed items.
        </li>
        <li>
          Users must adhere to our guidelines for item descriptions, pricing,
          and condition.
        </li>
      </ul>
      <h1>
        <b>Payment and Transactions:</b>
      </h1>
      <ul className="list-disc w-5/6">
        <li>
          Buyers and sellers are responsible for ensuring secure and timely
          payment.
        </li>
        <li>
          Sellers are responsible for accurately describing shipping methods,
          costs, and delivery times.
        </li>
        <li>
          Buyers must make payment promptly and in accordance with the agreed
          terms.
        </li>
      </ul>
      <h1>
        <b>Privacy and Data Protection:</b>
      </h1>
      <ul className="list-disc w-5/6">
        <li>
          We respect your privacy and handle your personal information in
          accordance with our privacy policy.
        </li>
        <li>
          Users are responsible for ensuring the accuracy and legality of the
          data they provide.
        </li>
      </ul>
      <h1>
        <b>Dispute Resolution:</b>
      </h1>
      <ul className="list-disc w-5/6">
        <li>
          In the event of a dispute between users, we encourage open
          communication and negotiation.
        </li>
        <li>
          If a resolution cannot be reached, users may request mediation or
          arbitration through our designated resolution center.
        </li>
      </ul>
      <h1>
        <b>Intellectual Property Rights:</b>
      </h1>
      <ul className="list-disc w-5/6">
        <li>Users must respect the intellectual property rights of others.</li>
        <li>
          Listings or sales of counterfeit, unauthorized, or infringing items
          are strictly prohibited.
        </li>
      </ul>
      <h1>
        <b>User Reviews and Ratings:</b>
      </h1>
      <ul className="list-disc w-5/6">
        <li>
          Users are encouraged to leave honest and fair reviews of their buying
          and selling experiences.
        </li>
        <li>
          We reserve the right to moderate and remove reviews that violate our
          guidelines.
        </li>
      </ul>
      <h1>
        <b>Termination and Suspension:</b>
      </h1>
      <ul className="list-disc w-5/6 mb-5">
        <li>
          We reserve the right to suspend or terminate user accounts for
          violations of our policies.
        </li>
        <li>
          Users may be banned from using the platform for engaging in fraudulent
          or illegal activities.
        </li>
      </ul>
    </div>
  );
}
