import { routeItems } from '@/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import React from 'react';
import { NavLink } from 'react-router-dom';

type NavigationLayoutProps = {
  children: React.ReactNode;
};

export const NavigationLayout = ({ children }: NavigationLayoutProps) => {
  return (
    <aside className="flex h-screen w-screen">
      <div className="h-full min-w-[200px] bg-navy px-4 py-2 text-white">
        <ul className="flex flex-col gap-y-3">
          {routeItems
            .filter((item) => item.isNav)
            .map((item) => {
              const navChildren =
                item.children?.filter((child) => child.isNav) || [];
              if (navChildren.length > 0) {
                return (
                  <li key={item.path}>
                    <button className="inline-block w-full cursor-default rounded px-3 py-1 text-left">
                      {item.icon && (
                        <FontAwesomeIcon icon={item.icon} className="mr-2" />
                      )}
                      {item.name}
                    </button>
                    <ul>
                      {navChildren?.map((child) => (
                        <li className="mt-1" key={`${item.path}${child.path}`}>
                          <NavLink
                            to={`${item.path}${child.path}`}
                            className={({ isActive }) =>
                              clsx(
                                'ml-6 inline-block w-[calc(100%-24px)] rounded px-3 py-1',
                                isActive && ' bg-white text-slate-800',
                              )
                            }
                          >
                            {child.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              } else {
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        clsx(
                          'inline-block w-full rounded px-3 py-1',
                          isActive && 'bg-white text-slate-800',
                        )
                      }
                    >
                      {item.icon && (
                        <FontAwesomeIcon icon={item.icon} className="mr-2" />
                      )}
                      {item.name}
                    </NavLink>
                  </li>
                );
              }
            })}
        </ul>
      </div>
      <section className="relative h-full w-full flex-1 overflow-y-auto bg-gray-100 px-8 py-4">
        {children}
      </section>
    </aside>
  );
};
