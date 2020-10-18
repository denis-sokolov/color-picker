module.exports = {
  alias: {
    "@lib": "./src/lib",
  },
  buildOptions: {
    clean: true,
  },
  devOptions: {
    open: "none",
  },
  exclude: ["*.d.ts"],
  mount: {
    src: "/",
  },
  plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-webpack"],
};
