import Image from "next/image";

// In any component where you want to display the image
export default function ImageDisplay({ imageBase64 }: { imageBase64: string }) {
    if (!imageBase64) return null;

    return (
        <Image
            src={imageBase64}
            alt="Stored image"
            className="max-w-[200px] h-auto rounded-lg"
        />
    );
}
