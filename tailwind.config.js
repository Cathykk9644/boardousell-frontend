/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/App.tsx",
    "./src/Component/Sub-Component/Navibar.tsx",
    "./src/Component/Sub-Component/ProductCard.tsx",
    "./src/Component/Sub-Component/ProductList.tsx",
    "./src/Component/Sub-Component/ShoppingCart.tsx",
    "./src/Component/Notice-Sub/NoticeSlide.tsx",
    "./src/Component/Notice-Sub/NoticePage.tsx",
    "./src/Component/Sub-Component/Wishlist.tsx",
    "./src/Component/AboutUsPage.tsx",
    "./src/Component/CheckoutPage.tsx",
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
