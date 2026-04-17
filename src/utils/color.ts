/**
 * カラーユーティリティ
 * 背景色に応じた最適なテキストカラーの選択など
 */

/**
 * 六角形（Hex）カラーコードをRGBに変換
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * RGB文字列 (rgb(255, 255, 255)) をオブジェクトに変換
 */
const parseRgb = (rgbStr: string): { r: number; g: number; b: number } | null => {
  const result = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgbStr);
  return result ? {
    r: parseInt(result[1], 10),
    g: parseInt(result[2], 10),
    b: parseInt(result[3], 10)
  } : null;
};

/**
 * 相対輝度を計算して、白か黒のコントラストが高い方を返す
 * @param colorStr Hex (#FFFFFF) または RGB (rgb(255, 255, 255)) 形式
 * @returns 'white' | 'black'
 */
export const getContrastColor = (colorStr: string | undefined): 'white' | 'black' => {
  if (!colorStr) return 'white';

  let rgb: { r: number; g: number; b: number } | null = null;

  if (colorStr.startsWith('#')) {
    rgb = hexToRgb(colorStr);
  } else if (colorStr.startsWith('rgb')) {
    rgb = parseRgb(colorStr);
  }

  if (!rgb) return 'white';

  // 相対輝度の計算 (W3C勧告に基づく)
  // https://www.w3.org/TR/WCAG20/#relativeluminancedef
  const { r, g, b } = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // 輝度の閾値を 0.7 に設定（より薄い色、ホワイト、ライトグレーのみ黒文字にする）
  return luminance > 0.7 ? 'black' : 'white';
};
