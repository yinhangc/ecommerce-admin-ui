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
    <div className="h-screen w-screen flex">
      <div className="h-full bg-slate-800 text-white py-2 px-4 min-w-[200px]">
        <nav className="flex flex-col gap-y-2">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              clsx(
                'inline-block py-1 px-3 rounded',
                isActive && 'bg-white text-slate-800'
              )
            }
          >
            <FontAwesomeIcon icon={faTag} className="mr-2" />
            Products
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              clsx(
                'inline-block py-1 px-3 rounded',
                isActive && 'bg-white text-slate-800'
              )
            }
          >
            <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-2" />
            Orders
          </NavLink>
        </nav>
      </div>
      <div className="h-full flex-1">{children}</div>
    </div>
  );
};
