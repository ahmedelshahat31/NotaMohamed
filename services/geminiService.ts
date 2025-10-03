
import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getFinancialSummary = async (transactions: Transaction[], period: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "مفتاح API الخاص بـ Gemini غير متوفر. يرجى التأكد من إعداده.";
  }

  if (transactions.length === 0) {
    return "لا توجد بيانات كافية لتوليد ملخص. يرجى إضافة بعض المعاملات أولاً.";
  }

  const formattedTransactions = transactions.map(t => 
    `${t.type === 'income' ? 'إيراد' : 'مصروف'}: ${t.amount.toFixed(2)} جنيه مصري - الفئة: ${t.category} - التاريخ: ${new Date(t.date).toLocaleDateString('ar-EG')}`
  ).join('\n');

  const prompt = `
    أنت مستشار مالي خبير. قم بتحليل بيانات المعاملات التالية للفترة (${period}) بالجنيه المصري وقدم ملخصًا ماليًا ذكيًا وموجزًا.
    يجب أن يتضمن الملخص:
    1.  نظرة عامة على إجمالي الإيرادات والمصروفات وصافي التدفق النقدي.
    2.  تحديد أكبر فئات المصروفات.
    3.  تقديم نصيحة واحدة أو اثنتين لتحسين الوضع المالي بناءً على البيانات المقدمة.
    4.  استخدم لغة عربية واضحة ومحفزة.

    بيانات المعاملات:
    ${formattedTransactions}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "عذرًا، حدث خطأ أثناء إنشاء الملخص الذكي. يرجى المحاولة مرة أخرى.";
  }
};
