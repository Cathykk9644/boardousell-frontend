/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/App.tsx",
    "./src/Component/Shared-component/Navibar.tsx",
    "./src/Component/Shared-component/ProductList.tsx",
    "./src/Component/Shared-component/ShoppingCart.tsx",
    "./src/Component/Shared-component/Wishlist.tsx",
    "./src/Component/AboutUsPage.tsx",
    "./src/Component/ExplorePage.tsx",
    "./src/Component/HomePage.tsx",
    "./src/Component/OrderListPage.tsx",
    "./src/Component/OrderPage.tsx",
    "./src/Component/PolicyPage.tsx",
    "./src/Component/ProductPage.tsx",
    "./src/Component/UserPage.tsx",
    "./src/Component/WrongPage.tsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["nord"],
  },
};
