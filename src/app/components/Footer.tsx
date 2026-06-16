import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 p-4 flex justify-between items-center">
      <div>
        <p>
          © 2025, GNAS WORLDWIDE -{" "}
          <Link href="/privacy-policy">Privacy policy</Link>
        </p>
      </div>
      <div className="flex space-x-4">
        <select className="border rounded p-1">
          <option>Vietnam | VND</option>
          {/* Add more options as needed */}
        </select>
        <div className="flex space-x-2">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-xl">f</span>
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-xl">ig</span>
          </a>
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-xl">t</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
