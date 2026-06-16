
"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

export default function ProfilePage() {
  const { profile, updateProfile } = useUserStore();
  const [loading, setLoading] = useState(false);
  
  // Local state for form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: ""
  });

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        address: profile.address || ""
      });
    }
  }, [profile]);

  const handleSave = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateProfile(formData);
      setLoading(false);
      toast({
        title: "Thành công",
        description: "Thông tin hồ sơ của bạn đã được cập nhật.",
      });
    }, 800);
  };

  if (!profile) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">Quản lý thông tin tài khoản và bảo mật của bạn.</p>
      </div>

      <Card className="bg-card/50 border-white/5 shadow-xl">
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Họ</Label>
              <Input 
                value={formData.firstName} 
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Nhập họ..."
                className="rounded-xl h-11 bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Tên</Label>
              <Input 
                value={formData.lastName} 
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Nhập tên..."
                className="rounded-xl h-11 bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Email (Không thể thay đổi)</Label>
            <Input value={profile.email} disabled className="rounded-xl h-11 bg-muted/30 opacity-60 cursor-not-allowed" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Số điện thoại</Label>
            <Input 
              value={formData.phone} 
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="090..."
              className="rounded-xl h-11 bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Địa chỉ mặc định</Label>
            <Input 
              value={formData.address} 
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Số nhà, tên đường..."
              className="rounded-xl h-11 bg-background/50"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="rounded-full px-10 h-12 font-bold shadow-lg shadow-primary/20 gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Lưu thay đổi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
