"use client";

import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MessageCircle,
  ExternalLink,
  Smartphone,
  Apple,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useConfigData } from "@/hooks/use-config";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const { config, isLoading } = useConfigData();
  const t = useTranslations("Footer");

  if (isLoading || !config) {
    return (
      <footer className="bg-gradient-to-r from-[#6a15b5] to-[#8238b2]/90 border-t border-[#941DFB]/20">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-4 bg-white/20 rounded w-32 mb-6"></div>
            <div className="space-y-3">
              <div className="h-3 bg-white/20 rounded w-24"></div>
              <div className="h-3 bg-white/20 rounded w-28"></div>
              <div className="h-3 bg-white/20 rounded w-20"></div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  const socialLinks = [
    { icon: Facebook, url: config.facebook, name: "Facebook" },
    { icon: Instagram, url: config.instagram, name: "Instagram" },
    { icon: Twitter, url: config.twitter, name: "Twitter" },
    { icon: Linkedin, url: config.linkedin, name: "LinkedIn" },
  ].filter((link) => link.url && link.url !== "https://www.twitter.com");

  const legalLinks = [
    { label: t("links.aboutUs"), url: config.about_us },
    { label: t("links.termsConditions"), url: config.terms_and_conditions },
    { label: t("links.privacyPolicy"), url: config.privacy_policy },
    { label: t("links.refundPolicy"), url: config.refund_policy },
    { label: t("links.contactUs"), url: config.contact_us },
  ].filter((link) => link.url);

  return (
    <footer className="bg-gradient-to-r from-[#6a15b5] to-[#8238b2]/90 border-t border-[#941DFB]/20">
      <div className="container mx-auto px-4 py-12 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Image
                  src="/logo.png"
                  width={24}
                  height={24}
                  alt="Narmer"
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white">
                <span className="text-white">Narmer</span>
              </span>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white/90 mb-3">
                  {t("followUs")}
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, url, name }) => (
                    <Link
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group"
                    >
                      <Icon className="w-4 h-4 text-white group-hover:text-white transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* App Downloads */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-white/90">
              {t("getTheApp")}
            </h3>
            <div className="space-y-3">
              {config.ios_app_url && (
                <Link
                  href={config.ios_app_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 transition-colors group"
                >
                  <Apple className="w-6 h-6 text-white" />
                  <div>
                    <div className="text-xs text-white/80">
                      {t("downloadOn")}
                    </div>
                    <div className="text-sm font-medium text-white">
                      {t("appStore")}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/70 ml-auto" />
                </Link>
              )}

              {config.android_app_url && (
                <Link
                  href={config.android_app_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 transition-colors group"
                >
                  <Smartphone className="w-6 h-6 text-white" />
                  <div>
                    <div className="text-xs text-white/80">{t("getItOn")}</div>
                    <div className="text-sm font-medium text-white">
                      {t("googlePlay")}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/70 ml-auto" />
                </Link>
              )}
            </div>

            {/* WhatsApp Contact */}
            {config.whatsapp && (
              <div className="pt-4 border-t border-white/20">
                <Link
                  href={config.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-white/90 transition-colors text-[#941DFB]"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{t("chatOnWhatsApp")}</span>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Link>
              </div>
            )}
          </div>

          {/* Legal Links */}
          {legalLinks.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-white/90">
                {t("support")}
              </h3>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-6 border-t border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/80">
              © {new Date().getFullYear()} Narmer. {t("allRightsReserved")}
            </p>
            <div className="flex items-center gap-4 text-xs text-white/80">
              <span>{t("madeWithLove")}</span>
              {config.deliveryman && (
                <span className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs font-medium">
                  {t("deliveryAvailable")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
