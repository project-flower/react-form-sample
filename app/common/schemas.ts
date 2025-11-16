import z from "zod";

/** 共通スキーマ */
export const commonSchema = {
  max10: z.string().max(10, { message: "10文字以内で入力してください" }),
  maxWithName: (item: string, maximum: number) => {
    return z.string().max(maximum, {
      message: `${item} は ${maximum} 文字以内で入力してください`,
    });
  },
  min10: z.string().min(10, { message: "10文字以上で入力してください" }),
  minWithName: (item: string, minimum: number) => {
    return z.string().min(minimum, {
      message: `${item} は ${minimum} 文字以上で入力してください`,
    });
  },
  required: () => {
    return z.string().min(1, { message: "入力してください" });
  },
  telephone: z.string().regex(/(^$)|([0-9]{10-11})/, {
    message: "数値 10 桁または 11 桁を入力してください",
  }),
};

/**
 * バリデーションを任意にします。
 * @param value 任意とするバリデーション
 */
export const optional = (value: z.ZodString) => {
  return value.or(z.literal(""));
};
