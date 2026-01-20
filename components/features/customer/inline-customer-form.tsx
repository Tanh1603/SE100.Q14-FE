"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Customer } from "@/types/customer";
import { CustomerStatus } from "@/types/enum";
import { useProvinces, useWardByProvince } from "@/hooks/use-location";
import { CustomerService } from "@/lib/customer.service";
import {
  ChevronDown,
  PlusCircle,
  Search,
  User,
  X,
  MapPin,
  CreditCard,
  Info,
  ImageUp,
  Loader2,
  AlertTriangle,
  Phone,
  Edit,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

interface InlineCustomerFormProps {
  onCustomerSelect: (
    customer: Customer & { mattruoc?: File; matsau?: File },
  ) => void;
  selectedCustomer: Customer | null;
  onClearCustomer: () => void;
}

interface QuickCustomerData {
  cccd: string;
  fullName: string;
  phone: string;
  email: string;
  dob: string;
  provinceId: string;
  wardId: string;
  permanentAddress: string;
  mattruoc?: File;
  matsau?: File;

  // New fields required by backend
  customerType: "REGULAR" | "VIP";
  issueDate: string;
  issuePlace: string;
  monthlyIncome: number;
  occupation: string;
  workplace: string;
  emergencyContactName: string;
  emergencyContactPhone: string;

  fatherName: string;
  fatherPhone: string;
  fatherOccupation: string;

  motherName: string;
  motherPhone: string;
  motherOccupation: string;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function InlineCustomerForm({
  onCustomerSelect,
  selectedCustomer,
  onClearCustomer,
}: InlineCustomerFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  const [quickCustomer, setQuickCustomer] = useState<QuickCustomerData>({
    cccd: "",
    fullName: "",
    phone: "",
    email: "",
    dob: "",
    provinceId: "",
    wardId: "",
    permanentAddress: "",
    customerType: "REGULAR", // Default
    issueDate: "",
    issuePlace: "",
    monthlyIncome: 0,
    occupation: "",
    workplace: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    fatherName: "",
    fatherPhone: "",
    fatherOccupation: "",
    motherName: "",
    motherPhone: "",
    motherOccupation: "",
  });

  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(
    null,
  );
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  // --- Location Data (using TanStack Query hooks) ---
  const { data: provinces = [], isLoading: provincesLoading } = useProvinces();

  // Find the selected province to get its 'code' for fetching wards
  const selectedProvince = provinces.find(
    (p) => p.id === quickCustomer.provinceId,
  );
  const provinceCode = selectedProvince?.code ?? "";

  const { data: wards = [], isLoading: wardsLoading } =
    useWardByProvince(provinceCode);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Search customers from API
  const handleSearch = useCallback(async () => {
    if (!debouncedSearchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await CustomerService.getAll(
        1,
        10,
        debouncedSearchQuery,
      );
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Failed to search customers:", error);
      toast.error("Không thể tìm kiếm khách hàng");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [debouncedSearchQuery]);

  // Trigger search when debounced query changes
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // Check for duplicate when CCCD or phone changes
  const checkDuplicate = useCallback(async (cccd: string, phone: string) => {
    if (!cccd && !phone) {
      setDuplicateWarning(null);
      return;
    }

    setIsCheckingDuplicate(true);
    try {
      // Search by CCCD
      if (cccd && cccd.length >= 9) {
        const cccdResult = await CustomerService.getAll(1, 5, cccd);
        if (cccdResult.data.length > 0) {
          const match = cccdResult.data.find((c) => c.cccd === cccd);
          if (match) {
            setDuplicateWarning(
              `⚠️ Số CCCD "${cccd}" đã tồn tại: ${match.fullName} (${match.phone})`,
            );
            setIsCheckingDuplicate(false);
            return;
          }
        }
      }

      // Search by phone
      if (phone && phone.length >= 9) {
        const phoneResult = await CustomerService.getAll(1, 5, phone);
        if (phoneResult.data.length > 0) {
          const match = phoneResult.data.find((c) => c.phone === phone);
          if (match) {
            setDuplicateWarning(
              `⚠️ Số điện thoại "${phone}" đã tồn tại: ${match.fullName} (CCCD: ${match.cccd})`,
            );
            setIsCheckingDuplicate(false);
            return;
          }
        }
      }

      setDuplicateWarning(null);
    } catch (error) {
      console.error("Failed to check duplicate:", error);
    } finally {
      setIsCheckingDuplicate(false);
    }
  }, []);

  // Debounced CCCD and phone for duplicate checking
  const debouncedCccd = useDebounce(quickCustomer.cccd, 500);
  const debouncedPhone = useDebounce(quickCustomer.phone, 500);

  useEffect(() => {
    if (showCreateForm) {
      checkDuplicate(debouncedCccd, debouncedPhone);
    }
  }, [debouncedCccd, debouncedPhone, showCreateForm, checkDuplicate]);

  const handleSelectCustomer = (customer: Customer) => {
    onCustomerSelect(customer);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleCreate = async () => {
    // Comprehensive Validation
    const {
      fullName,
      phone,
      cccd,
      email,
      issueDate,
      issuePlace,
      provinceId,
      wardId,
      permanentAddress,
      monthlyIncome,
      occupation,
      workplace,
      emergencyContactName,
      emergencyContactPhone,
      fatherName,
      fatherPhone,
      fatherOccupation,
      motherName,
      motherPhone,
      motherOccupation,
      mattruoc,
      matsau,
    } = quickCustomer;

    if (!fullName || !phone || !cccd || !email) {
      toast.error("Vui lòng điền các thông tin cơ bản: Tên, SĐT, CCCD, Email");
      return;
    }

    if (!issueDate || !issuePlace) {
      toast.error("Vui lòng nhập Ngày cấp và Nơi cấp CCCD");
      return;
    }

    // Validate Issue Date format YYYY-MM-DD (input date gives this standard)
    if (!issueDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      toast.error("Ngày cấp CCCD không hợp lệ");
      return;
    }

    if (!mattruoc || !matsau) {
      toast.error("Vui lòng tải lên ảnh CCCD mặt trước và mặt sau");
      return;
    }

    if (!provinceId || !wardId || !permanentAddress) {
      toast.error("Vui lòng nhập đầy đủ địa chỉ thường trú");
      return;
    }

    if (
      !occupation ||
      !workplace ||
      monthlyIncome <= 0 ||
      isNaN(monthlyIncome)
    ) {
      toast.error("Vui lòng nhập thông tin nghề nghiệp và thu nhập hợp lệ");
      return;
    }

    if (!emergencyContactName || !emergencyContactPhone) {
      toast.error("Vui lòng nhập thông tin liên hệ khẩn cấp");
      return;
    }

    if (
      !fatherName ||
      !fatherPhone ||
      !fatherOccupation ||
      !motherName ||
      !motherPhone ||
      !motherOccupation
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin cha/mẹ");
      return;
    }

    // Check duplicate warning
    if (duplicateWarning) {
      toast.error(
        "Không thể tạo khách hàng trùng lặp. Vui lòng kiểm tra CCCD và số điện thoại.",
      );
      return;
    }

    // Create a new customer with ALL info
    // Note: We cast to 'any' lightly here because the frontend Customer type might lag behind the backend DTO
    const newCustomer: Customer & { mattruoc?: File; matsau?: File } = {
      id: `new-${Date.now()}`,
      avatar: "",
      fullName: fullName.toUpperCase(),
      dob: quickCustomer.dob || "1990-01-01",
      phone: phone,
      email: email,
      cccd: cccd,
      issueDate: issueDate,
      issuePlace: issuePlace,
      address: permanentAddress,
      wardId: wardId,
      provinceId: provinceId,
      permanentAddress: permanentAddress,
      status: CustomerStatus.NORMAL,

      otherInfo: {
        job: occupation,
        workplace: workplace,
        income: monthlyIncome.toString(), // Frontend uses string, backend expects number? Backend error said "expected number". We will pass number in the actual DTO construction later or here if aligned.
        emergencyContactName: emergencyContactName,
        emergencyContactPhone: emergencyContactPhone,
      },
      familyInfo: {
        father: {
          fullName: fatherName,
          phone: fatherPhone,
          job: fatherOccupation,
        },
        mother: {
          fullName: motherName,
          phone: motherPhone,
          job: motherOccupation,
        },
      },
      mattruoc: mattruoc,
      matsau: matsau,
      // Additional properties to match backend expectation directly if needed
      // We attach them to the object so the Service can forward them
      ...({
        monthlyIncome: Number(monthlyIncome),
        fatherName,
        fatherPhone,
        fatherOccupation,
        motherName,
        motherPhone,
        motherOccupation,
        occupation,
        workplace,
        emergencyContactName,
        emergencyContactPhone,
        nationalIdIssueDate: issueDate,
        nationalIdIssuePlace: issuePlace,
        customerType: quickCustomer.customerType,
      } as any),
    };

    onCustomerSelect(newCustomer);
    setShowCreateForm(false);

    // Reset form to defaults
    setQuickCustomer({
      cccd: "",
      fullName: "",
      phone: "",
      email: "",
      dob: "",
      provinceId: "",
      wardId: "",
      permanentAddress: "",
      customerType: "REGULAR",
      issueDate: "",
      issuePlace: "",
      monthlyIncome: 0,
      occupation: "",
      workplace: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      fatherName: "",
      fatherPhone: "",
      fatherOccupation: "",
      motherName: "",
      motherPhone: "",
      motherOccupation: "",
    });
    setFrontImagePreview(null);
    setBackImagePreview(null);
    setDuplicateWarning(null);
  };

  const handleEdit = () => {
    if (!selectedCustomer) return;

    // Type guard/cast for extra properties
    const cust = selectedCustomer as any;

    setQuickCustomer({
      fullName: selectedCustomer.fullName || "",
      phone: selectedCustomer.phone || "",
      email: selectedCustomer.email || "",
      cccd: selectedCustomer.cccd || "",
      dob: selectedCustomer.dob || "",
      provinceId: selectedCustomer.provinceId || "",
      wardId: selectedCustomer.wardId || "",
      permanentAddress: selectedCustomer.permanentAddress || "",
      customerType: cust.customerType || "REGULAR",
      issueDate: selectedCustomer.issueDate || cust.nationalIdIssueDate || "",
      issuePlace:
        selectedCustomer.issuePlace || cust.nationalIdIssuePlace || "",
      monthlyIncome: Number(
        selectedCustomer.otherInfo?.income || cust.monthlyIncome || 0,
      ),
      occupation: selectedCustomer.otherInfo?.job || cust.occupation || "",
      workplace: selectedCustomer.otherInfo?.workplace || cust.workplace || "",
      emergencyContactName:
        selectedCustomer.otherInfo?.emergencyContactName ||
        cust.emergencyContactName ||
        "",
      emergencyContactPhone:
        selectedCustomer.otherInfo?.emergencyContactPhone ||
        cust.emergencyContactPhone ||
        "",
      fatherName:
        selectedCustomer.familyInfo?.father?.fullName || cust.fatherName || "",
      fatherPhone:
        selectedCustomer.familyInfo?.father?.phone || cust.fatherPhone || "",
      fatherOccupation:
        selectedCustomer.familyInfo?.father?.job || cust.fatherOccupation || "",
      motherName:
        selectedCustomer.familyInfo?.mother?.fullName || cust.motherName || "",
      motherPhone:
        selectedCustomer.familyInfo?.mother?.phone || cust.motherPhone || "",
      motherOccupation:
        selectedCustomer.familyInfo?.mother?.job || cust.motherOccupation || "",

      mattruoc: cust.mattruoc,
      matsau: cust.matsau,
    });

    if (cust.mattruoc) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => setFrontImagePreview(reader.result as string);
        reader.readAsDataURL(cust.mattruoc);
      } catch (e) {
        console.error("Cannot read front image", e);
      }
    }
    if (cust.matsau) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => setBackImagePreview(reader.result as string);
        reader.readAsDataURL(cust.matsau);
      } catch (e) {
        console.error("Cannot read back image", e);
      }
    }

    onClearCustomer(); // Clear selection to show form
    setShowCreateForm(true); // Ensure form is open
  };

  // If customer is already selected, show the preview
  if (selectedCustomer) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 relative group transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0 shadow-sm">
            {selectedCustomer.fullName
              .split(" ")
              .slice(-2)
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="font-bold text-gray-900 truncate text-base">
              {selectedCustomer.fullName}
            </h4>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> {selectedCustomer.phone}
              </span>
              <span className="flex items-center gap-1 font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                <CreditCard className="w-3 h-3" /> {selectedCustomer.cccd}
              </span>
            </div>
            {selectedCustomer.permanentAddress && (
              <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />{" "}
                {selectedCustomer.permanentAddress}
              </p>
            )}
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
            onClick={handleEdit}
            title="Chỉnh sửa thông tin"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            onClick={onClearCustomer}
            title="Xóa khách hàng này"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tìm khách hàng có sẵn</Label>
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <Input
              placeholder="Nhập SĐT, CCCD hoặc Tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 transition-shadow focus:ring-2 focus:ring-primary/20"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-gray-400">
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Tìm kiếm tự động khi nhập (theo tên, SĐT hoặc CCCD)
        </p>
      </div>

      {/* Search Results */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="border rounded-lg max-h-64 overflow-y-auto divide-y bg-white shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500">
            Tìm thấy {searchResults.length} khách hàng
          </div>
          {searchResults.map((customer) => (
            <div
              key={customer.id}
              className="p-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors"
              onClick={() => handleSelectCustomer(customer)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
                {customer.fullName
                  .split(" ")
                  .slice(-2)
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-gray-900">
                  {customer.fullName}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {customer.phone}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1 font-mono bg-gray-100 px-1 rounded">
                    <CreditCard className="w-3 h-3" />
                    {customer.cccd}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              >
                Chọn
              </Button>
            </div>
          ))}
        </div>
      )}

      {showSearchResults && searchResults.length === 0 && !isSearching && (
        <div className="text-center py-6 text-sm text-gray-500 border border-dashed rounded-lg bg-gray-50/50">
          <p>Không tìm thấy khách hàng phù hợp.</p>
          <Button
            variant="link"
            onClick={() => setShowCreateForm(true)}
            className="text-primary h-auto p-0 mt-1"
          >
            Tạo mới ngay?
          </Button>
        </div>
      )}

      {/* Inline Create Form */}
      <Collapsible
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        className="border rounded-lg bg-gray-50/30 overflow-hidden"
      >
        <CollapsibleTrigger
          className={cn(
            "flex items-center justify-between w-full p-4 text-left transition-colors",
            showCreateForm ? "bg-white border-b" : "hover:bg-gray-50",
          )}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-1.5 rounded-md",
                showCreateForm
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-200 text-gray-500",
              )}
            >
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm block text-gray-800">
                Tạo khách hàng mới
              </span>
              {!showCreateForm && (
                <span className="text-xs text-muted-foreground block">
                  Nếu chưa có trong hệ thống
                </span>
              )}
            </div>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform duration-200",
              showCreateForm && "rotate-180",
            )}
          />
        </CollapsibleTrigger>

        <CollapsibleContent className="animate-collapsible-down">
          <div className="p-4 bg-white space-y-4">
            {/* Duplicate warning */}
            {duplicateWarning && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2 text-amber-800 text-sm animate-in fade-in">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <p className="font-medium">Có thể trùng lặp!</p>
                  <p className="text-xs mt-0.5">{duplicateWarning}</p>
                </div>
              </div>
            )}

            {/* --- COMPLETE FORM --- */}
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-md flex gap-2 items-start">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Vui lòng điền đầy đủ thông tin để tạo hồ sơ khách hàng.</p>
              </div>

              {/* 1. Personal Info */}
              <div className="space-y-3 border p-3 rounded-lg bg-gray-50/50">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" /> Thông tin cá nhân
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={quickCustomer.fullName}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          fullName: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="NGUYỄN VĂN A"
                      className="uppercase"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={quickCustomer.phone}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          phone: e.target.value,
                        })
                      }
                      placeholder="0912..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={quickCustomer.email}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          email: e.target.value,
                        })
                      }
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Ngày sinh</Label>
                    <Input
                      type="date"
                      value={quickCustomer.dob}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          dob: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Loại khách hàng</Label>
                    <Select
                      value={quickCustomer.customerType}
                      onValueChange={(v: "REGULAR" | "VIP") =>
                        setQuickCustomer({ ...quickCustomer, customerType: v })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="REGULAR">
                          Thường (REGULAR)
                        </SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 2. ID Card Info */}
              <div className="space-y-3 border p-3 rounded-lg bg-gray-50/50">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Căn cước công dân
                </h4>
                <div className="grid grid-cols-1 space-y-1">
                  <Label className="text-xs">
                    Số CCCD <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={quickCustomer.cccd}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          cccd: e.target.value,
                        })
                      }
                      placeholder="079..."
                      className={cn(
                        duplicateWarning?.includes("CCCD") &&
                          "border-amber-400 ring-1 ring-amber-400",
                      )}
                    />
                    {isCheckingDuplicate && (
                      <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Ngày cấp (YYYY-MM-DD)
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={quickCustomer.issueDate}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          issueDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Nơi cấp <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={quickCustomer.issuePlace}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          issuePlace: e.target.value,
                        })
                      }
                      placeholder="Cục CS QLHC..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {/* Front Image */}
                  <div
                    className="relative h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-50 transition-colors bg-white"
                    onClick={() => frontInputRef.current?.click()}
                  >
                    {frontImagePreview ? (
                      <Image
                        src={frontImagePreview}
                        alt="CCCD Front"
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <ImageUp className="w-5 h-5 text-gray-400" />
                        <span className="text-[10px] text-gray-500">
                          Mặt trước *
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      ref={frontInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setQuickCustomer((prev) => ({
                            ...prev,
                            mattruoc: file,
                          }));
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            setFrontImagePreview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  {/* Back Image */}
                  <div
                    className="relative h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-50 transition-colors bg-white"
                    onClick={() => backInputRef.current?.click()}
                  >
                    {backImagePreview ? (
                      <Image
                        src={backImagePreview}
                        alt="CCCD Back"
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <ImageUp className="w-5 h-5 text-gray-400" />
                        <span className="text-[10px] text-gray-500">
                          Mặt sau *
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      ref={backInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setQuickCustomer((prev) => ({
                            ...prev,
                            matsau: file,
                          }));
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            setBackImagePreview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Address Info */}
              <div className="space-y-3 border p-3 rounded-lg bg-gray-50/50">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Địa chỉ liên hệ
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    value={quickCustomer.provinceId}
                    onValueChange={(val) =>
                      setQuickCustomer({
                        ...quickCustomer,
                        provinceId: val,
                        wardId: "",
                      })
                    }
                    disabled={provincesLoading}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Tỉnh/TP" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={quickCustomer.wardId}
                    onValueChange={(val) =>
                      setQuickCustomer({ ...quickCustomer, wardId: val })
                    }
                    disabled={!quickCustomer.provinceId || wardsLoading}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Phường/Xã" />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder="Số nhà, tên đường..."
                  value={quickCustomer.permanentAddress}
                  onChange={(e) =>
                    setQuickCustomer({
                      ...quickCustomer,
                      permanentAddress: e.target.value,
                    })
                  }
                />
              </div>

              {/* 4. Job & Income */}
              <div className="space-y-3 border p-3 rounded-lg bg-gray-50/50">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Nghề nghiệp & Thu nhập
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Nghề nghiệp <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={quickCustomer.occupation}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          occupation: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Nơi làm việc <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={quickCustomer.workplace}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          workplace: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">
                      Thu nhập hàng tháng (VNĐ){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      value={quickCustomer.monthlyIncome || ""}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          monthlyIncome: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* 5. Emergency Contact */}
              <div className="space-y-3 border p-3 rounded-lg bg-gray-50/50">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Liên hệ khẩn cấp
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Người liên hệ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={quickCustomer.emergencyContactName}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          emergencyContactName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">
                      SDT Liên hệ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={quickCustomer.emergencyContactPhone}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          emergencyContactPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* 6. Family Info */}
              <div className="space-y-3 border p-3 rounded-lg bg-gray-50/50">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" /> Thông tin gia đình
                </h4>
                {/* Father */}
                <div className="space-y-2 pb-2 border-b border-dashed">
                  <p className="text-xs font-semibold text-gray-500">
                    Thông tin Cha <span className="text-red-500">*</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Họ tên"
                      value={quickCustomer.fatherName}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          fatherName: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="SĐT"
                      value={quickCustomer.fatherPhone}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          fatherPhone: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Nghề nghiệp"
                      value={quickCustomer.fatherOccupation}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          fatherOccupation: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                {/* Mother */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500">
                    Thông tin Mẹ <span className="text-red-500">*</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Họ tên"
                      value={quickCustomer.motherName}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          motherName: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="SĐT"
                      value={quickCustomer.motherPhone}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          motherPhone: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Nghề nghiệp"
                      value={quickCustomer.motherOccupation}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          motherOccupation: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="button"
              className="w-full mt-4 font-semibold"
              onClick={handleCreate}
              disabled={!!duplicateWarning}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Tạo Hồ Sơ
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
