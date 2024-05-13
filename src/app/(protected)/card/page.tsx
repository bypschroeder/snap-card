import { db } from "~/server/db"

async function Images() {
  const images = await db.query.images.findMany({
    orderBy: (model, {desc}) => desc(model.id)
  })
  return (
    <div className="flex flex-wrap gap-4">
      {images.map((image) => (
        <div key={image.id} className="w-48">
          <img src={image.url} alt="image" />
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
