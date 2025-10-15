import { NextResponse } from 'next/server'

export async function GET() {
  const languages = [
    { code: 'en', name: 'English', locale: 'en-US', flag: 'US' },
    { code: 'es', name: 'Español', locale: 'es-ES', flag: 'ES' },
    { code: 'fr', name: 'Français', locale: 'fr-FR', flag: 'FR' },
    { code: 'de', name: 'Deutsch', locale: 'de-DE', flag: 'DE' },
    { code: 'it', name: 'Italiano', locale: 'it-IT', flag: 'IT' },
    { code: 'pt', name: 'Português', locale: 'pt-BR', flag: 'BR' },
    { code: 'ru', name: 'Русский', locale: 'ru-RU', flag: 'RU' },
    { code: 'ja', name: '日本語', locale: 'ja-JP', flag: 'JP' },
    { code: 'zh', name: '中文', locale: 'zh-CN', flag: 'CN' },
    { code: 'ko', name: '한국어', locale: 'ko-KR', flag: 'KR' },
    { code: 'ar', name: 'العربية', locale: 'ar-SA', flag: 'SA' },
    { code: 'hi', name: 'हिन्दी', locale: 'hi-IN', flag: 'IN' },
    { code: 'th', name: 'ไทย', locale: 'th-TH', flag: 'TH' },
    { code: 'vi', name: 'Tiếng Việt', locale: 'vi-VN', flag: 'VN' },
    { code: 'id', name: 'Bahasa Indonesia', locale: 'id-ID', flag: 'ID' },
    { code: 'ms', name: 'Bahasa Melayu', locale: 'ms-MY', flag: 'MY' },
    { code: 'tl', name: 'Filipino', locale: 'tl-PH', flag: 'PH' },
    { code: 'tr', name: 'Türkçe', locale: 'tr-TR', flag: 'TR' },
    { code: 'pl', name: 'Polski', locale: 'pl-PL', flag: 'PL' },
    { code: 'nl', name: 'Nederlands', locale: 'nl-NL', flag: 'NL' },
    { code: 'sv', name: 'Svenska', locale: 'sv-SE', flag: 'SE' },
    { code: 'no', name: 'Norsk', locale: 'no-NO', flag: 'NO' },
    { code: 'da', name: 'Dansk', locale: 'da-DK', flag: 'DK' },
    { code: 'fi', name: 'Suomi', locale: 'fi-FI', flag: 'FI' },
    { code: 'el', name: 'Ελληνικά', locale: 'el-GR', flag: 'GR' },
    { code: 'he', name: 'עברית', locale: 'he-IL', flag: 'IL' },
    { code: 'cs', name: 'Čeština', locale: 'cs-CZ', flag: 'CZ' },
    { code: 'hu', name: 'Magyar', locale: 'hu-HU', flag: 'HU' },
    { code: 'ro', name: 'Română', locale: 'ro-RO', flag: 'RO' },
    { code: 'uk', name: 'Українська', locale: 'uk-UA', flag: 'UA' },
    { code: 'bg', name: 'Български', locale: 'bg-BG', flag: 'BG' },
    { code: 'hr', name: 'Hrvatski', locale: 'hr-HR', flag: 'HR' },
    { code: 'sk', name: 'Slovenčina', locale: 'sk-SK', flag: 'SK' },
    { code: 'sl', name: 'Slovenščina', locale: 'sl-SI', flag: 'SI' }
  ]

  return NextResponse.json({ languages })
}