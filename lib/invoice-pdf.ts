/**
 * 견적서 PDF 생성 모듈
 *
 * html2canvas와 jsPDF를 사용하여 견적서를 PDF로 변환합니다.
 * 클라이언트 사이드에서 동작하며, 브라우저 렌더링을 통한 정확한 PDF 생성이 가능합니다.
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Invoice } from '@/types';

/**
 * 견적서 PDF 생성 및 다운로드
 *
 * HTML 요소를 캡처하여 PDF로 변환하고 사용자 디바이스에 다운로드합니다.
 *
 * @param elementId - PDF로 변환할 HTML 요소의 ID
 * @param invoice - 견적서 데이터 (파일명 생성용)
 * @throws {Error} 요소를 찾을 수 없거나 PDF 생성 실패 시
 *
 * @example
 * // HTML:
 * // <div id="invoice-content">
 * //   <!-- 견적서 콘텐츠 -->
 * // </div>
 * //
 * // // React:
 * // <button onClick={() => generateInvoicePdf('invoice-content', invoice)}>
 * //   PDF 다운로드
 * // </button>
 */
export async function generateInvoicePdf(
  elementId: string,
  invoice: Invoice
): Promise<void> {
  try {
    // 1. HTML 요소 찾기
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`ID "${elementId}"인 요소를 찾을 수 없습니다.`);
    }

    // 2. HTML을 Canvas로 변환 (이미지 해상도: 150dpi)
    const canvas = await html2canvas(element, {
      scale: 2, // 고해상도 렌더링
      useCORS: true, // CORS 이미지 포함
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    // 3. 캔버스 크기 계산
    const imgWidth = 210; // A4 너비 (mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/png');

    // 4. PDF 생성
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // 5. PDF에 이미지 추가
    let currentHeight = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const maxHeight = pageHeight - margin * 2;

    pdf.addImage(imgData, 'PNG', margin, currentHeight + margin, imgWidth - margin * 2, imgHeight);
    currentHeight += imgHeight + margin;

    // 페이지 추가 (필요한 경우)
    while (currentHeight > maxHeight) {
      pdf.addPage();
      currentHeight -= maxHeight;
    }

    // 6. PDF 다운로드
    const fileName = `견적서_${invoice.title}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'PDF 생성 중 오류가 발생했습니다';
    throw new Error(errorMessage);
  }
}

/**
 * 견적서 PDF 생성 (다운로드 없음)
 *
 * HTML 요소를 PDF Blob으로 변환합니다.
 * 저장하거나 업로드 등 추가 처리가 필요한 경우 사용합니다.
 *
 * @param elementId - PDF로 변환할 HTML 요소의 ID
 * @param fileName - 생성된 PDF의 파일명 (확장자 제외)
 * @returns PDF Blob 객체
 * @throws {Error} 요소를 찾을 수 없거나 PDF 생성 실패 시
 *
 * @example
 * const pdfBlob = await generateInvoicePdfBlob('invoice-content', '견적서_123');
 * const formData = new FormData();
 * formData.append('file', pdfBlob);
 * await fetch('/api/invoices/upload-pdf', { method: 'POST', body: formData });
 */
export async function generateInvoicePdfBlob(
  elementId: string,
  fileName: string
): Promise<Blob> {
  try {
    // 1. HTML 요소 찾기
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`ID "${elementId}"인 요소를 찾을 수 없습니다.`);
    }

    // 2. HTML을 Canvas로 변환
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    // 3. 캔버스 크기 계산
    const imgWidth = 210; // A4 너비 (mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/png');

    // 4. PDF 생성
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // 5. PDF에 이미지 추가
    const margin = 10;
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth - margin * 2, imgHeight);

    // 6. PDF Blob 반환
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'PDF 생성 중 오류가 발생했습니다';
    throw new Error(errorMessage);
  }
}
