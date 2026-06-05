const API_HOOKS = {
  useProducts: (params?: any) => {
    // Returns { data, loading, error, refetch }
  },
  useProduct: (id: string) => {
    // Returns { product, loading, error }
  },
  useOrders: () => {
    // Returns { orders, loading, error }
  },
};

export default API_HOOKS;
