export default function HeadingOne({text}: {text: string}) {
  return (
    <section className="py-16">
      <h1 className="text-lg font-medium text-grey md:text-xl">{text}</h1>
    </section>
  );
}
