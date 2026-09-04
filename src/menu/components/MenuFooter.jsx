const MenuFooter = ({ restaurantName }) => (
  <footer className="px-4 pb-8 pt-2 text-center sm:px-6">
    <p className="text-xs text-menu-text-muted">
      {restaurantName ? `${restaurantName} © ${new Date().getFullYear()}` : null}
    </p>
  </footer>
);

export default MenuFooter;
