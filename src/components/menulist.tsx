import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../redux/menuSlice";
import { addToCart } from "../redux/cartSlice";
import { RootState, AppDispatch } from "../redux/store";

const MenuList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.menu
  );

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  if (loading) {
    return <p>loading</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  const dipItems = items.filter((item) => item.type === "dip");
  const drinkItems = items.filter((item) => item.type === "drink");
  const wontonItems = items.filter((item) => item.type === "wonton");

  return (
    <div className="menu">
      <h2 className="menu__title">MENU</h2>
      <section className="menu__list">
        {wontonItems.map((item) => {
          return (
            <article
              className="menu__list__item"
              onClick={() => dispatch(addToCart(item))}
            >
              <section className="menu__list__item__title__price">
                <p className="menu__list__item__price--title">{item.name} </p>
                <section className="menu__list__item__price--dotted--line">
                  .............................
                </section>
                <p className="menu__list__item__title__price--price">
                  ${item.price}
                </p>
              </section>
              <p className="menu__list__item__ingredients">
                {item.ingredients.join(",")}
              </p>
            </article>
          );
        })}
        <article className="menu__list__item__dip">
          <section className="menu__list__item__dip__group">
            <p className="menu__list__item__dip__group--title">Dipsås</p>
            <section className="menu__list__item__dip__group--dotted">
              .....................
            </section>
            <p className="menu__list__item__dip__group--price">19kr</p>
          </section>

          <section className="menu__list__item__dip__frame">
            {dipItems.map((item) => (
              <button
                className="menu__list__item__dip__frame__btn"
                onClick={() => dispatch(addToCart(item))}
              >
                {item.name}
              </button>
            ))}
          </section>
        </article>

        <article className="menu__list__item__drink">
          <section className="menu__list__item__drink__group">
            <p className="menu__list__item__drink__group--title">Dryck</p>
            <section className="menu__list__item__drink__group--dotted">
              .....................
            </section>
            <p className="menu__list__item__drink__group--price">19kr</p>
          </section>
          <section className="menu__list__item__drink__frame">
            {drinkItems.map((item) => (
              <button
                className="menu__list__item__drink__frame__btn"
                onClick={() => dispatch(addToCart(item))}
              >
                {item.name}
              </button>
            ))}
          </section>
        </article>
      </section>
    </div>
  );
};

export default MenuList;
