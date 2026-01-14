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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Customer } from "@/types/customer";
import { CustomerStatus } from "@/types/enum";
import { LocationService, Province, Ward } from "@/lib/location.service";
import { mockCustomer } from "@/mock-data/customer";
import {
  ChevronDown,
  // ... (rest of imports)
  PlusCircle,
  Search,
  User,
  X,
  MapPin,
  CreditCard,
  Info,
  ImageUp,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface InlineCustomerFormProps {
  onCustomerSelect: (
    customer: Customer & { mattruoc?: File; matsau?: File }
  ) => void;
  selectedCustomer: Customer | null;
  onClearCustomer: () => void;
}

interface QuickCustomerData {
  cccd: string;
  fullName: string;
  phone: string;
  dob: string;
  provinceId: string;
  wardId: string;
  permanentAddress: string;
  mattruoc?: File;
  matsau?: File;
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
  const [creationMode, setCreationMode] = useState<"quick" | "full">("quick");

  const [quickCustomer, setQuickCustomer] = useState<QuickCustomerData>({
    cccd: "",
    fullName: "",
    phone: "",
    dob: "",
    provinceId: "",
    wardId: "",
    permanentAddress: "",
  });

  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(
    null
  );
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  // --- Location State ---
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // Fetch provinces on mount
  useEffect(() => {
    LocationService.getProvinces().then(setProvinces).catch(console.error);
  }, []);

  // Fetch wards when provinceId changes
  useEffect(() => {
    if (quickCustomer.provinceId) {
      // Find the selected province to get its 'code' (not 'id') for the API call
      const selectedProvince = provinces.find(
        (p) => p.id === quickCustomer.provinceId
      );
      if (selectedProvince) {
        LocationService.getWardsByProvince(selectedProvince.code)
          .then(setWards)
          .catch(console.error);
      }
    } else {
      setWards([]);
    }
  }, [quickCustomer.provinceId, provinces]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = mockCustomer.filter(
      (c) =>
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.cccd.includes(searchQuery)
    );

    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  const handleSelectCustomer = (customer: Customer) => {
    onCustomerSelect(customer);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleQuickCreate = () => {
    // Basic validation
    if (
      !quickCustomer.fullName ||
      !quickCustomer.phone ||
      !quickCustomer.cccd
    ) {
      alert("Vui lòng nhập đầy đủ: Họ tên, Số điện thoại và số CCCD");
      return;
    }

    // In 'Full' mode, require CCCD, images, and address
    if (creationMode === "full") {
      if (!quickCustomer.cccd) {
        alert("Vui lòng nhập số CCCD cho chế độ đầy đủ");
        return;
      }
      if (!quickCustomer.mattruoc || !quickCustomer.matsau) {
        alert("Vui lòng tải lên ảnh CCCD mặt trước và mặt sau");
        return;
      }
      if (
        !quickCustomer.provinceId ||
        !quickCustomer.wardId ||
        !quickCustomer.permanentAddress
      ) {
        alert(
          "Vui lòng nhập đầy đủ địa chỉ thường trú (Tỉnh/TP, Phường/Xã, Số nhà)"
        );
        return;
      }
    }

    // Create a new customer with info
    const newCustomer: Customer & { mattruoc?: File; matsau?: File } = {
      id: `new-${Date.now()}`,
      avatar: "",
      fullName: quickCustomer.fullName.toUpperCase(),
      dob: quickCustomer.dob || "1990-01-01",
      phone: quickCustomer.phone,
      email: "",
      cccd: quickCustomer.cccd || `DRAFT-${Date.now()}`, // Handle missing CCCD in quick mode
      issueDate: "",
      issuePlace: "",
      address: quickCustomer.permanentAddress,
      wardId: quickCustomer.wardId,
      provinceId: quickCustomer.provinceId,
      permanentAddress: quickCustomer.permanentAddress,
      status: CustomerStatus.NORMAL,
      otherInfo: {
        job: "",
        workplace: "",
        income: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
      },
      familyInfo: {
        father: { fullName: "", phone: "", job: "" },
        mother: { fullName: "", phone: "", job: "" },
      },
      mattruoc: quickCustomer.mattruoc,
      matsau: quickCustomer.matsau,
    };

    onCustomerSelect(newCustomer);
    setShowCreateForm(false);
    // Reset form
    setQuickCustomer({
      cccd: "",
      fullName: "",
      phone: "",
      dob: "",
      provinceId: "",
      wardId: "",
      permanentAddress: "",
    });
    setFrontImagePreview(null);
    setBackImagePreview(null);
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
                <User className="w-3 h-3" /> {selectedCustomer.phone}
              </span>
              <span className="flex items-center gap-1">
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
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          onClick={onClearCustomer}
          title="Xóa khách hàng này"
        >
          <X className="w-4 h-4" />
        </Button>
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
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pr-10 transition-shadow focus:ring-2 focus:ring-primary/20"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-primary"
              onClick={handleSearch}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="border rounded-lg max-h-48 overflow-y-auto divide-y bg-white shadow-sm animate-in fade-in slide-in-from-top-2">
          {searchResults.map((customer) => (
            <div
              key={customer.id}
              className="p-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors"
              onClick={() => handleSelectCustomer(customer)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">
                {customer.fullName
                  .split(" ")
                  .slice(-2)
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-gray-900">
                  {customer.fullName}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{customer.phone}</span>
                  <span>•</span>
                  <span>{customer.cccd}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSearchResults && searchResults.length === 0 && (
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
            showCreateForm ? "bg-white border-b" : "hover:bg-gray-50"
          )}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-1.5 rounded-md",
                showCreateForm
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-200 text-gray-500"
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
              showCreateForm && "rotate-180"
            )}
          />
        </CollapsibleTrigger>

        <CollapsibleContent className="animate-collapsible-down">
          <div className="p-4 bg-white space-y-4">
            <Tabs
              defaultValue="quick"
              onValueChange={(v) => setCreationMode(v as "quick" | "full")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="quick">Tạo nhanh (Quick)</TabsTrigger>
                <TabsTrigger value="full">Đầy đủ (Full)</TabsTrigger>
              </TabsList>

              {/* --- QUICK MODE --- */}
              <TabsContent value="quick" className="space-y-4 mt-0">
                <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-md flex gap-2 items-start">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    Chế độ này chỉ yêu cầu Tên và SĐT để tạo nhanh hồ sơ. Bạn có
                    thể cập nhật CCCD và địa chỉ sau.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="grid gap-1.5">
                    <Label className="text-xs font-semibold uppercase text-gray-500">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="VD: NGUYỄN VĂN A"
                      className="uppercase font-medium"
                      value={quickCustomer.fullName}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          fullName: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs font-semibold uppercase text-gray-500">
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="090xxxxxxx"
                      value={quickCustomer.phone}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs font-semibold uppercase text-gray-500">
                      Số CCCD <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="12 số trên thẻ căn cước"
                      value={quickCustomer.cccd}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          cccd: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              {/* --- FULL MODE --- */}
              <TabsContent value="full" className="space-y-4 mt-0">
                <div className="grid gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Số CCCD <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="079XXXXXXXXX"
                      value={quickCustomer.cccd}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          cccd: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="NGUYEN VAN A"
                      className="uppercase"
                      value={quickCustomer.fullName}
                      onChange={(e) =>
                        setQuickCustomer({
                          ...quickCustomer,
                          fullName: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">
                        Số điện thoại <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="0901234567"
                        value={quickCustomer.phone}
                        onChange={(e) =>
                          setQuickCustomer({
                            ...quickCustomer,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Ngày sinh</Label>
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
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">
                      Ảnh CCCD (Mặt trước & Mặt sau){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className="relative h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-50 transition-colors bg-gray-50/50"
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
                              Mặt trước
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
                      <div
                        className="relative h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-50 transition-colors bg-gray-50/50"
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
                              Mặt sau
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

                  <div className="space-y-2 pt-2 border-t">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">
                      Địa chỉ thường trú <span className="text-red-500">*</span>
                    </Label>
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
                        disabled={!quickCustomer.provinceId}
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
                </div>
              </TabsContent>
            </Tabs>

            <Button
              type="button"
              className="w-full mt-4 font-semibold"
              onClick={handleQuickCreate}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {creationMode === "quick"
                ? "Tạo nhanh hồ sơ"
                : "Tạo hồ sơ đầy đủ"}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
