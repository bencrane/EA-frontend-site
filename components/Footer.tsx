export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-600 text-sm">
            {currentYear} Everything Automation. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 text-gray-500 text-sm">
            Streamlining business processes through intelligent automation
          </div>
        </div>
      </div>
    </footer>
  );
}
