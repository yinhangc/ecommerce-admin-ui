import { faFileInvoiceDollar, faTag } from '@fortawesome/free-solid-svg-icons';
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
      <div className="h-full min-w-[200px] bg-slate-800 px-4 py-2 text-white">
        <ul className="flex flex-col gap-y-3">
          <li>
            <button className="inline-block w-full cursor-default rounded px-3 py-1 text-left">
              <FontAwesomeIcon icon={faTag} className="mr-2" />
              產品
            </button>
            <ul>
              <li className="mt-1">
                <NavLink
                  to="/products/list"
                  className={({ isActive }) =>
                    clsx(
                      'ml-6 inline-block w-[calc(100%-24px)] rounded px-3 py-1',
                      isActive && ' bg-white text-slate-800',
                    )
                  }
                >
                  檢視產品
                </NavLink>
              </li>
              <li className="mt-1">
                <NavLink
                  to="/products/create"
                  className={({ isActive }) =>
                    clsx(
                      'ml-6 inline-block w-[calc(100%-24px)] rounded px-3 py-1',
                      isActive && ' bg-white text-slate-800',
                    )
                  }
                >
                  創建產品
                </NavLink>
              </li>
            </ul>
          </li>
          <li>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                clsx(
                  'inline-block w-full rounded px-3 py-1',
                  isActive && 'bg-white text-slate-800',
                )
              }
            >
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-2" />
              訂單
            </NavLink>
          </li>
        </ul>
      </div>
      <section className="relative h-full w-full flex-1 overflow-y-auto bg-gray-100 px-8 py-4">
        {children}
      </section>
    </aside>
  );
};
