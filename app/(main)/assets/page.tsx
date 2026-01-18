"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SidebarInset } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Archive,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Gavel,
  MapPin,
  AlertTriangle,
  Package,
  FileText,
  User,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CollateralService } from "@/lib/collateral.service";
import { LoanService } from "@/lib/loan.service";
import { CollateralAssetResponse } from "@/types/dto/collateral.dto";
import { AssetActionPanel } from "@/components/features/asset/asset-action-panel";
import { useUser } from "@clerk/nextjs";
import { getUserRole, isManagerOrAdmin } from "@/lib/role.helper";
import { cn } from "@/lib/utils";
import {
  AssetCreationSidePanel,
  AssetDraft,
} from "@/components/features/contract/asset-creation-side-panel";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ASSET_STATUS_OPTIONS } from "@/types/enum";
import { StoreService } from "@/lib/store.service";
import { Store } from "@/types/store";

// Loan with collateral assets interface
interface LoanWithAssets {
  loanId: string;
  loanCode: string;
  customerName: string;
  loanStatus: string;
  isOverdue: boolean;
  loanAmount?: number;
  assets: CollateralAssetResponse[];
}

const AssetPage = () => {
  const router = useRouter();
  const [loansWithAssets, setLoansWithAssets] = useState<LoanWithAssets[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] =
    useState<CollateralAssetResponse | null>(null);
  const [panelMode, setPanelMode] = useState<
    "create" | "view" | "location" | "liquidate" | "sell"
  >("view");
  const [collateralTypes, setCollateralTypes] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [expandedLoans, setExpandedLoans] = useState<Set<string>>(new Set());
  const [stores, setStores] = useState<Store[]>([]);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { user } = useUser();
  const role = getUserRole(user?.publicMetadata);
  const isAdminOrManager = isManagerOrAdmin(role);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all collateral assets with filters
      const response = await CollateralService.getAll(page, limit, "", {
        status: statusFilter === "ALL" ? undefined : statusFilter,
        collateralTypeId: typeFilter === "ALL" ? undefined : Number(typeFilter),
      });
      const assets = response.data;

      // Group assets by loanId
      const loanMap = new Map<string, CollateralAssetResponse[]>();
      const unlinkedAssets: CollateralAssetResponse[] = [];

      for (const asset of assets) {
        if (asset.loanId) {
          if (!loanMap.has(asset.loanId)) {
            loanMap.set(asset.loanId, []);
          }
          loanMap.get(asset.loanId)!.push(asset);
        } else {
          unlinkedAssets.push(asset);
        }
      }

      // Fetch loan details for each unique loanId
      const loanIds = Array.from(loanMap.keys());
      const loansData: LoanWithAssets[] = [];

      await Promise.all(
        loanIds.map(async (loanId) => {
          try {
            const loan = await LoanService.getLoanById(loanId);
            loansData.push({
              loanId,
              loanCode: loan.loanCode || `HĐ-${loanId.slice(0, 6)}`,
              customerName: loan.customer?.fullName || "Không xác định",
              loanStatus: loan.status,
              isOverdue: loan.status === "OVERDUE",
              loanAmount: loan.loanAmount,
              assets: loanMap.get(loanId) || [],
            });
          } catch {
            // Fallback if loan fetch fails
            const assetList = loanMap.get(loanId) || [];
            loansData.push({
              loanId,
              loanCode: assetList[0]?.loanCode || `HĐ-${loanId.slice(0, 6)}`,
              customerName: assetList[0]?.ownerName || "Không xác định",
              loanStatus: "UNKNOWN",
              isOverdue: false,
              assets: assetList,
            });
          }
        }),
      );

      // Add unlinked assets as a special group
      if (unlinkedAssets.length > 0) {
        loansData.push({
          loanId: "UNLINKED",
          loanCode: "Tài sản chưa liên kết",
          customerName: "-",
          loanStatus: "N/A",
          isOverdue: false,
          assets: unlinkedAssets,
        });
      }

      // Sort: Overdue loans first, then by loanCode
      loansData.sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        return a.loanCode.localeCompare(b.loanCode);
      });

      setLoansWithAssets(loansData);
      setTotalItems(response.meta.totalItems);
      setTotalPages(response.meta.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, typeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    CollateralService.getCollateralTypes()
      .then((data) => setCollateralTypes(data))
      .catch((e) => console.error(e));

    StoreService.getStores()
      .then((res) => {
        if (res && res.data) setStores(res.data);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleAction = (
    action: "view" | "location" | "liquidate" | "sell",
    asset: CollateralAssetResponse,
  ) => {
    setSelectedAsset(asset);
    setPanelMode(action);
    setPanelOpen(true);
  };

  const handleCreate = () => {
    setSelectedAsset(null);
    setPanelMode("create");
    setPanelOpen(true);
  };

  const handleAssetCreateSubmit = async (assetDraft: AssetDraft) => {
    try {
      setLoading(true);
      const payload = {
        collateralTypeId: Number(assetDraft.assetTypeId),
        ownerName: assetDraft.ownerName || "Khách lẻ",
        collateralInfo: assetDraft.fieldValues,
        status: "STORED",
        storageLocation: assetDraft.warehouseId,
        receivedDate: new Date().toISOString(),
        appraisedValue: Number(assetDraft.valuation || 0),
      };

      await CollateralService.create(
        payload,
        assetDraft.imageFiles.length > 0 ? assetDraft.imageFiles : undefined,
      );
      toast.success("Tạo tài sản thành công");
      setPanelOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tạo tài sản");
    } finally {
      setLoading(false);
    }
  };

  const toggleLoanExpanded = (loanId: string) => {
    setExpandedLoans((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(loanId)) {
        newSet.delete(loanId);
      } else {
        newSet.add(loanId);
      }
      return newSet;
    });
  };

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalAssets = loansWithAssets.reduce(
      (acc, loan) => acc + loan.assets.length,
      0,
    );
    const overdueLoans = loansWithAssets.filter((l) => l.isOverdue).length;
    return { totalAssets, overdueLoans, totalLoans: loansWithAssets.length };
  }, [loansWithAssets]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      {
        label: string;
        className: string;
      }
    > = {
      PROPOSED: {
        label: "Mới / Đề xuất",
        className: "bg-sky-100 text-sky-800 hover:bg-sky-100 border-sky-200",
      },
      PLEDGED: {
        label: "Đang cầm cố",
        className:
          "bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200",
      },
      STORED: {
        label: "Đã nhập kho",
        className:
          "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200",
      },
      LIQUIDATING: {
        label: "Đang thanh lý",
        className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
      },
      SOLD: {
        label: "Đã bán",
        className:
          "bg-teal-100 text-teal-800 hover:bg-teal-100 border-teal-200",
      },
      RELEASED: {
        label: "Đã trả khách",
        className:
          "bg-gray-200 text-gray-800 hover:bg-gray-200 border-gray-300",
      },
      REJECTED: {
        label: "Đã từ chối",
        className:
          "bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200",
      },
    };

    const config = statusConfig[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getLoanStatusBadge = (status: string, isOverdue: boolean) => {
    if (isOverdue) {
      return (
        <Badge
          variant="destructive"
          className="gap-1 bg-red-600 hover:bg-red-700 text-white border-transparent"
        >
          <AlertTriangle className="h-3 w-3" />
          Quá hạn
        </Badge>
      );
    }

    const statusConfig: Record<
      string,
      {
        label: string;
        className: string;
      }
    > = {
      ACTIVE: {
        label: "Đang hoạt động",
        className:
          "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
      },
      PENDING: {
        label: "Chờ duyệt",
        className:
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
      },
      CLOSED: {
        label: "Đã đóng",
        className:
          "bg-slate-800 text-slate-100 hover:bg-slate-700 border-transparent",
      },
      REJECTED: {
        label: "Đã từ chối",
        className:
          "bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200",
      },
    };

    const config = statusConfig[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <SidebarInset>
      <div className="mx-5 pb-10">
        <div className="flex my-5 items-center justify-between">
          <div className="flex items-center">
            <Archive className="text-primary mr-5" />
            <p className="text-2xl text-primary font-bold">
              Quản lý tài sản cầm cố
            </p>
          </div>
          {isAdminOrManager && (
            <Button onClick={handleCreate}>
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm tài sản
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng tài sản</p>
                <p className="text-2xl font-bold">{stats.totalAssets}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số hợp đồng</p>
                <p className="text-2xl font-bold">{stats.totalLoans}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Hợp đồng quá hạn
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.overdueLoans}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-xl border shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPage(1); // Reset page on filter change
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  {ASSET_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.trim()}>
                      {option.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="LIQUIDATING">Đang thanh lý</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Loại tài sản</Label>
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value);
                  setPage(1); // Reset page on filter change
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tất cả loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả loại</SelectItem>
                  {collateralTypes.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Loans with Assets List */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              Đang tải dữ liệu...
            </div>
          ) : loansWithAssets.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Không có dữ liệu tài sản
            </div>
          ) : (
            <>
              {/* Loan Cards */}
              <div className="divide-y">
                {loansWithAssets.map((loan) => (
                  <div key={loan.loanId} className="transition-colors">
                    {/* Loan Header Row - Clickable to expand */}
                    <div
                      className={cn(
                        "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                        loan.isOverdue && "bg-red-50/50 hover:bg-red-50",
                        expandedLoans.has(loan.loanId) && "bg-muted/30",
                      )}
                      onClick={() => toggleLoanExpanded(loan.loanId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Expand/Collapse Icon */}
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                            {expandedLoans.has(loan.loanId) ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>

                          {/* Loan Info */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-lg">
                                {loan.loanCode}
                              </span>
                              {getLoanStatusBadge(
                                loan.loanStatus,
                                loan.isOverdue,
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {loan.customerName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                {loan.assets.length} tài sản
                              </span>
                              {loan.loanAmount && (
                                <span>
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(loan.loanAmount)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {loan.loanId !== "UNLINKED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-1 text-muted-foreground hover:text-primary"
                              onClick={() =>
                                router.push(`/contracts/${loan.loanId}`)
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="hidden sm:inline">Chi tiết</span>
                            </Button>
                          )}

                          {loan.isOverdue && isAdminOrManager && (
                            <Badge variant="destructive" className="h-8">
                              <Gavel className="h-3 w-3 mr-1" />
                              Có thể thanh lý
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Assets List */}
                    {expandedLoans.has(loan.loanId) && (
                      <div className="bg-muted/20 border-t">
                        <div className="p-2">
                          <table className="w-full">
                            <thead>
                              <tr className="text-xs text-muted-foreground uppercase">
                                <th className="text-left p-2">Tài sản</th>
                                <th className="text-left p-2">Trạng thái</th>
                                <th className="text-left p-2">Chủ sở hữu</th>
                                <th className="text-left p-2">Vị trí</th>
                                <th className="text-left p-2">Định giá</th>
                                <th className="text-left p-2">Giá bán</th>
                                <th className="text-right p-2">Thao tác</th>
                              </tr>
                            </thead>
                            <tbody>
                              {loan.assets.map((asset) => (
                                <tr
                                  key={asset.id}
                                  className="border-t border-muted hover:bg-white/50 transition-colors cursor-pointer"
                                  onClick={() => handleAction("view", asset)}
                                >
                                  <td className="p-2">
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {(asset.collateralInfo
                                          ?.name as string) ||
                                          (asset.collateralInfo
                                            ?.description as string) ||
                                          `Tài sản #${asset.id.slice(0, 6)}`}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        Loại: {asset.collateralTypeId}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    {getStatusBadge(asset.status)}
                                  </td>
                                  <td className="p-2 text-sm">
                                    {asset.ownerName}
                                  </td>
                                  <td className="p-2">
                                    {asset.storageLocation ? (
                                      <span className="flex items-center gap-1 text-sm">
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                        {stores.find(
                                          (s) => s.id === asset.storageLocation,
                                        )?.name || asset.storageLocation}
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground text-sm">
                                        -
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-2 text-sm">
                                    {asset.appraisedValue
                                      ? new Intl.NumberFormat("vi-VN", {
                                          style: "currency",
                                          currency: "VND",
                                        }).format(asset.appraisedValue)
                                      : "-"}
                                  </td>
                                  <td className="p-2 text-sm">
                                    {asset.status === "LIQUIDATING" &&
                                    asset.sellPrice ? (
                                      <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">
                                          Giá định bán
                                        </span>
                                        <span className="font-medium text-orange-600">
                                          {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                          }).format(asset.sellPrice)}
                                        </span>
                                      </div>
                                    ) : asset.status === "SOLD" &&
                                      asset.sellPrice ? (
                                      <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">
                                          Giá bán thực tế
                                        </span>
                                        <span className="font-medium text-teal-600">
                                          {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                          }).format(asset.sellPrice)}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">
                                        -
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-2 text-right">
                                    <div
                                      className="flex gap-1 justify-end"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                          handleAction("view", asset)
                                        }
                                      >
                                        Xem
                                      </Button>
                                      {isAdminOrManager &&
                                        (asset.status === "PLEDGED" ||
                                          asset.status === "STORED") && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              handleAction("location", asset)
                                            }
                                          >
                                            <MapPin className="h-3 w-3" />
                                          </Button>
                                        )}
                                      {/* Liquidate button - ONLY for overdue loans */}
                                      {isAdminOrManager &&
                                        loan.isOverdue &&
                                        (asset.status === "PLEDGED" ||
                                          asset.status === "STORED") && (
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                              handleAction("liquidate", asset)
                                            }
                                          >
                                            <Gavel className="h-3 w-3 mr-1" />
                                            Thanh lý
                                          </Button>
                                        )}
                                      {/* Sell button for assets already in liquidation */}
                                      {isAdminOrManager &&
                                        asset.status === "LIQUIDATING" && (
                                          <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() =>
                                              handleAction("sell", asset)
                                            }
                                          >
                                            Đã bán
                                          </Button>
                                        )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-gray-500">
                  Trang {page} / {totalPages || 1} ({totalItems} tài sản)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {panelMode === "create" ? (
        <AssetCreationSidePanel
          open={panelOpen}
          onOpenChange={setPanelOpen}
          onAddAsset={handleAssetCreateSubmit}
          showOwnerField={true}
        />
      ) : (
        <AssetActionPanel
          open={panelOpen}
          onOpenChange={setPanelOpen}
          asset={selectedAsset}
          mode={panelMode}
          onSuccess={fetchData}
          isAdminOrManager={isAdminOrManager}
        />
      )}
    </SidebarInset>
  );
};

export default AssetPage;
