interface Props {
  title?: string;
  description?: string;
}

const NotFound = ({ title, description }: Props) => {
  return (
    <section className="flex justify-center mt-12">
      <div className="flex flex-col space-y-2 items-start">
        <h1 className="text-3xl font-extrabold tracking-wide">{title}</h1>
        <p className="font-normal text-gray-200">{description}</p>
      </div>
    </section>
  )
}

export default NotFound