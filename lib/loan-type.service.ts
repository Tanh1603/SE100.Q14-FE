import { ConfigurationService } from "@/lib/configuration.service";

export interface LoanType {
  id: number;
  name: string;
  interestRateMonthly: number;
  durationMonths: number;
  description?: string;
  productCode?: string;
}

export const LoanTypeService = {
  getAll: async (): Promise<LoanType[]> => {
    try {
      const configs = await ConfigurationService.getConfigurations("SYSTEM");
      const loanProductsJson = configs["SUPPORTED_LOAN_PRODUCTS"];
      
      if (loanProductsJson) {
        return JSON.parse(loanProductsJson) as LoanType[];
      }
      
      console.warn("SUPPORTED_LOAN_PRODUCTS key not found in SYSTEM configurations.");
      return [];
    } catch (error) {
      console.error("Failed to fetch/parse loan types from configurations:", error);
      return [];
    }
  },
  
  getById: async (id: number): Promise<LoanType | undefined> => {
    const types = await LoanTypeService.getAll();
    return types.find(t => t.id === id);
  }
};