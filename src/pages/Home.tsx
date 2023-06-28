type homeProps = {
  children?: React.ReactNode | {};
};

export default function Home({ children }: homeProps): JSX.Element {
  return (
    <>
      <div className="bg-cyan-700">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Toothache?
              <br />
              We Got You Covered.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-cyan-200">
              Sign-in now and find the best dentists around you in no time!
            </p>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
