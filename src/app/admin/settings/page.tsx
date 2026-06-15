
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
        <p className="text-muted-foreground">Quản lý cấu hình cửa hàng và hệ thống.</p>
      </div>

      <div className="space-y-6">
        <Card className="border-white/5 bg-card/50">
          <CardHeader>
            <CardTitle>Thông tin cửa hàng</CardTitle>
            <CardDescription>Các thông tin cơ bản về thương hiệu của bạn.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên cửa hàng</Label>
                <Input defaultValue="S-Com Hub Demo Store" />
              </div>
              <div className="space-y-2">
                <Label>Slogan</Label>
                <Input defaultValue="Công nghệ cho tương lai" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mô tả ngắn</Label>
              <Textarea defaultValue="Nền tảng thương mại điện tử đa năng, đa vendor, hỗ trợ Việt Nam." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email liên hệ</Label>
                <Input defaultValue="contact@scomhub.vn" />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input defaultValue="1900 1234" />
              </div>
            </div>
            <Separator className="bg-white/5" />
            <div className="flex justify-end">
              <Button className="rounded-full px-8">Lưu thay đổi</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-card/50">
          <CardHeader>
            <CardTitle>Giao diện & Thương hiệu</CardTitle>
            <CardDescription>Tùy chỉnh màu sắc và logo của cửa hàng.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-white/5">
              <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">S</div>
              <div>
                <p className="font-bold text-sm">Logo cửa hàng</p>
                <p className="text-xs text-muted-foreground">PNG, JPG tối đa 5MB. Khuyên dùng 512x512px.</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">Thay đổi</Button>
            </div>
            <div className="space-y-2">
              <Label>Màu chủ đạo (Primary Color)</Label>
              <div className="flex gap-4">
                <Input type="color" className="w-20 h-10 p-1 bg-background" defaultValue="#9757EA" />
                <Input className="font-mono" defaultValue="#9757EA" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="rounded-full px-8">Cập nhật giao diện</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
