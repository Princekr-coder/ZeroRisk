import { AvatarComponent } from "./AvatarComponent";
import { Mail, Calendar, ShieldCheck } from "lucide-react";

export function ProfileCard({ user, onEdit }) {
  return (
    <div className="bg-card text-card-foreground shadow-sm rounded-2xl border border-border overflow-hidden">
      {/* Decorative Banner */}
      <div className="h-32 bg-gradient-to-r from-primary/80 to-blue-600/80 relative">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]" />
      </div>
      
      <div className="px-6 sm:px-10 pb-8 relative">
        {/* Avatar positioning */}
        <div className="-mt-12 mb-4 flex justify-between items-end">
          <AvatarComponent name={user.name} />
          <button
            onClick={onEdit}
            className="mb-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-sm font-semibold transition-colors"
          >
            Edit Profile
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground font-medium flex items-center mt-1">
            <ShieldCheck className="w-4 h-4 mr-1.5 text-primary" />
            Standard Account
          </p>
        </div>

        <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="flex items-center p-4 rounded-xl bg-muted/40 border border-border/50">
            <Mail className="w-5 h-5 text-muted-foreground mr-3" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">Email Address</p>
              <p className="text-sm font-medium text-foreground">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 rounded-xl bg-muted/40 border border-border/50">
            <Calendar className="w-5 h-5 text-muted-foreground mr-3" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">Member Since</p>
              <p className="text-sm font-medium text-foreground">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Just now"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
