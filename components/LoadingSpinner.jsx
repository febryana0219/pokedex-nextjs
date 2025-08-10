import Image from "next/image"

export default function LoadingSpinner({ size = 200 }) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Image
        src="/gif/loading.gif"
        alt="Loading..."
        width={size}
        height={size}
        unoptimized
        priority
        className="object-contain"
      />
    </div>
  )
}
