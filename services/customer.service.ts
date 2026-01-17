const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const customerKeys = {
  all: ["customers"] as const,
  list: () => [...customerKeys.all, "list"] as const,
  detail: (id: string) => [...customerKeys.all, "detail", id] as const,
};

export const CustomerService = {
  list: async (token: string) => {
    try {
      console.log("API_BASE_URL =", API_BASE_URL);

      const res = await fetch(`${API_BASE_URL}/customers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(res);
      return data;
    } catch (error) {
      console.log("test", error);
    }
  },

  getById: async (id: string, token: string) => {
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log("no", data);
    return data;
  },

  //   create: async (data: CreateCustomerDto) => {
  //     const customer = await fetch(`${API_BASE_URL}/customers`);
  //     return res.data;
  //   },

  //   update: async (id: string, data: Partial<CreateCustomerDto>) => {
  //     const customer = await fetch(`${API_BASE_URL}/customers`);
  //     return res.data;
  //   },
};
