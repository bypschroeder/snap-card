import { getMyImages } from "~/server/queries"
import Image from "next/image"

async function Images() {
  const images = await getMyImages()

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {images.map((image) => (
        <div key={image.id} className="w-48 h-48">
          <Image src={image.url} style={{objectFit: "contain"}} width={192} height={192} alt={image.name} />
          <p>{image.name}</p>
        </div>
      ))}
    </div>
  )
}

const CardPage = () => {
  return (
    <div className="pt-24">
      <h1>CardPage</h1>
      <Images />
    </div>
  )
}

export default CardPage;
