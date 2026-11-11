import xandeFace from "@/assets/xande-rosto.webp";
import { cn } from "@/lib/utils";

/**
 * O rosto do Xande, o mascote do AF, num círculo claro.
 * É decorativo: o nome "Xande" sempre aparece em texto ao lado, ou no
 * rótulo do botão. Passe o tamanho pela classe (ex.: "h-11 w-11").
 */
export function XandeAvatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("block flex-none overflow-hidden rounded-full bg-teal-soft", className)}
    >
      <img
        src={xandeFace}
        alt=""
        width={192}
        height={192}
        decoding="async"
        draggable={false}
        className="h-full w-full select-none object-cover"
      />
    </span>
  );
}
