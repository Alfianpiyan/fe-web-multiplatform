const stats = [
  {
    value: "10.000+",
    label: "Total Laporan",
  },
  {
    value: "95%",
    label: "Tingkat Penyelesaian",
  },
  {
    value: "2 Hari",
    label: "Rata-rata Respon",
  },
  {
    value: "8+",
    label: "Kategori Laporan",
  },
];

export default function Statistics() {
  return (
    <section
      id="statistik"
      className="py-24 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <span
            className="
              inline-flex
              px-4
              py-2
              rounded-full
              bg-red-50
              text-red-600
              text-sm
              font-medium
            "
          >
            Statistik
          </span>

          <h2
            className="
              mt-5
              text-4xl
              md:text-5xl
              font-bold
              text-gray-900
            "
          >
            Dipercaya Oleh
            <span className="text-red-600">
              {" "}Ribuan Masyarakat
            </span>
          </h2>

          <p
            className="
              mt-4
              max-w-2xl
              mx-auto
              text-gray-500
            "
          >
            LaporYuk membantu masyarakat
            menyampaikan laporan secara cepat,
            transparan, dan terpantau.
          </p>

        </div>

        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          {stats.map((item, index) => (
            <div
              key={index}
              className="
                bg-white
                rounded-3xl
                p-8
                text-center
                border
                border-gray-100
                hover:border-red-200
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              <h3
                className="
                  text-4xl
                  font-bold
                  text-red-600
                "
              >
                {item.value}
              </h3>

              <p
                className="
                  mt-3
                  text-gray-600
                "
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}