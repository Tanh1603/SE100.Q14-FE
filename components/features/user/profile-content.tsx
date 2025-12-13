import { staffs } from "@/mock-data/staff";

type ProfileContentProps = {
  userId: string;
};

export function ProfileContent({ userId }: ProfileContentProps) {
  const staff = staffs.find((s) => s.userId === userId);

  if (!staff) return <div>Không tìm thấy thông tin nhân viên</div>;

  return (
    <div className="space-y-3">
      <div>
        <p>
          <b>Họ tên:</b> {staff.fullName}
        </p>
        <p>
          <b>Email:</b> {staff.email}
        </p>
        <p>
          <b>Trạng thái:</b> {staff.status}
        </p>
        <p>
          <b>Vai trò:</b> {staff.id.startsWith("manager") ? "Manager" : "Staff"}
        </p>
      </div>
    </div>
  );
}
