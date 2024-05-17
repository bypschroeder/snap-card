import { getMyImages } from "~/server/queries"
import Image from "next/image"
import { SimpleUploadButton } from "~/components/simple-upload-button"

async function Images() {
  const images = await getMyImages()

  return (
    <div className="flex flex-wrap gap-8 justify-center">
      {images.map((image) => (
        <div key={image.id} className="w-48 h-48">
          <Image src={image.url} style={{objectFit: "contain"}} width={192} height={192} alt={image.name} />
          <p>{image.name}</p>
        </div>
      ))}
    </div>
  )
}

const ImagesPage = () => {
  return (
    <div className="mt-8">
      <div className="flex flex-col justify-center items-center gap-8">
        <SimpleUploadButton />
        <Images />
      </div>
    </div>
  )
}

export default ImagesPage;
