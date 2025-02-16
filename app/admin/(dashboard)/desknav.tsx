"use client"
import { VercelLogo } from '@/components/admin/icons';
import { NavItem } from './nav-item';
import { useState } from 'react';
import {
    BookType,
    BrickWall,
    Building,
    ChevronLeft,
    ChevronLeftCircle,
    ChevronRight,
    ChevronRightCircle,
    CircleDollarSign,
    FoldersIcon,
    HandHeart,
    HeartPulse,
    Home,
    Info,
    LanguagesIcon,
    Newspaper,
    PanelLeft,
    PanelRight,
    ScrollText,
    Settings,
    UserRoundCheck,
    Users2,
    VideoIcon
  } from 'lucide-react';

import Link from 'next/link';
import clsx from 'clsx';

export default function DesktopNav() {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
      <aside className={clsx(
        "relative left-0 z-10 hidden flex-col border-r bg-background sm:flex transition-all duration-300",
        isExpanded ? "w-64" : "w-14"
      )}>
        <div className="flex justify-end p-2">
            <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute top-2 -right-4"
            >
            {isExpanded ? <ChevronLeftCircle className="size-8" /> : <ChevronRightCircle className="size-8" />}
            </button>
        </div>
        <nav className="flex flex-col gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className={clsx(
                "group flex h-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground transition-all",
                isExpanded ? "px-4" : "w-9"
              )}
          >
            <VercelLogo className="h-3 w-3 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
  
          <NavItem href="/admin/language" label="Ngôn ngữ" full={isExpanded}>
            <LanguagesIcon className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/setting" label="Cài đặt" full={isExpanded}>
            <Settings className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/introduce" label="Giới thiệu" full={isExpanded}>
            <Info className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/facilities" label="Cơ sở vật chất" full={isExpanded}>
            <BrickWall className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/file-manager" label="Quản lý tập tin" full={isExpanded}>
            <FoldersIcon className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/account" label="Quản lý tài khoản" full={isExpanded}>
            <Users2 className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/home-content" label="Nội dung trang chủ" full={isExpanded}>
            <Home className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/service" label="Quản lý dịch vụ" full={isExpanded}>
            <HandHeart className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/price-sheet" label="Quản lý bảng giá" full={isExpanded}>
            <CircleDollarSign className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/department" label="Quản lý khoa" full={isExpanded}>
            <Building className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/doctor" label="Quản lý bác sĩ" full={isExpanded}>
            <HeartPulse className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/story" label="Quản lý câu chuyện" full={isExpanded}>
            <ScrollText className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/show" label="Quản lý Show" full={isExpanded}>
            <VideoIcon className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/blog-type" label="Quản lý loại bài viết" full={isExpanded}>
            <BookType className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/blog" label="Quản lý bài viết" full={isExpanded}>
            <Newspaper className="h-5 w-5" />
          </NavItem>
  
          <NavItem href="/admin/user-request" label="Quản lý yêu cầu" full={isExpanded} >
            <UserRoundCheck className="h-5 w-5" />
          </NavItem>
  
        </nav>
      </aside>
    );
  }