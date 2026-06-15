
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">Quản lý thông tin tài khoản và bảo mật của bạn.</p>
      </div>

      <Card className="bg-card/50 border-white/5">
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Họ và tên</Label>
              <Input defaultValue="Nguyễn Văn A" />
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input defaultValue="090 123 4567" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue="vana@gmail.com" disabled />
          </div>
          <div className="space-y-2">
            <Label>Địa chỉ mặc định</Label>
            <Input defaultValue="123 Lê Lợi, Quận 1, TP. HCM" />
          </div>
          <div className="flex justify-end pt-4">
            <Button className="rounded-full px-8">Lưu thay đổi</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
