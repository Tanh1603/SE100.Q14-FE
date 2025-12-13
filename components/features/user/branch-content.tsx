import { branches } from "@/mock-data/branches";
import { staffs } from "@/mock-data/staff";

type BranchContentProps = {
  userId: string;
};

export function BranchContent({ userId }: BranchContentProps) {
  const userStaffs = staffs.filter((s) => s.userId === userId);

  if (userStaffs.length === 0) return <div>Không có chi nhánh nào</div>;

  const userBranches = branches.filter((b) =>
    userStaffs.some((s) => s.branchId === b.id)
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Thông tin cửa hàng</h2>

      {userBranches.map((branch) => (
        <div key={branch.id} className="rounded-lg border p-3 space-y-1">
          <p>
            <b>Tên:</b> {branch.name}
          </p>
          <p>
            <b>Địa chỉ:</b> {branch.address}
          </p>
          <p>
            <b>SĐT:</b> {branch.phone}
          </p>
          <p>
            <b>Trạng thái:</b>{" "}
            <span
              className={
                branch.status === "active" ? "text-green-600" : "text-red-600"
              }
            >
              {branch.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
