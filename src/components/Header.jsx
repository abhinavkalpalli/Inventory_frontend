import logo from '../assets/StockFlow.png'

function Header() {
  return (
    <nav className="bg-gray-800 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-center">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 rounded-full"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
