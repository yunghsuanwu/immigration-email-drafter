import { Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions, feedback, or need assistance with the email drafting tool, please
            reach out to us:
          </p>
          <span className="flex items-center gap-2 mb-4">
            <Mail className="inline h-5 w-5 text-blue-500" />
            <strong>contact[at]notastranger[dot]org</strong>
          </span>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>© {currentYear} Not A Stranger. All rights reserved.</p>
          <p className="mt-2">
            Created by{' '}
            <a
              href="https://www.notastranger.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              Not A Stranger
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}