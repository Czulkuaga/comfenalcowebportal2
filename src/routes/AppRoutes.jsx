import React from 'react';

//router
import {
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
    Route
} from "react-router-dom";

//Import View Components

import SelectOptions from '../components/views/home/SelectOptions';
import FindCorredor from '../components/views/findCorredor/FindCorredor';
import CreateindividualCustomer from '../components/views/CreateIndividualCustomer/CreateIndividualCustomer'
import CreateCorporate from '../components/views/CreateCorporate/CreateCorporate'
import CreateCorporateFromRefer from '../components/views/CreateCorporateFromReferir/CreateCorporateFromRefer'
import CreateTicketReferirCorporate from '../components/views/TicketReferirCorporate/CreateTicketReferirCorporate';
import VerifyCorredor from '../components/views/VerifyCorredor/VerifyCorredor';
import TicketInscriptionCorredor from '../components/views/TicketInscriptionCorredor/TicketInscriptionCorredor';
import FindCorporate from '../components/views/FindCorporate/FindCorporate';
import FindTicketPQRS from '../components/views/TicketPQRS/FindTicketPQRS';
import InfoTicketPQRS from '../components/views/TicketPQRS/InfoTicketPQRS';
import FindClient from '../components/views/TicketPQRS/CreateTicketPQRS/FindClient';
import CreateIndividualCustomerPQRS from '../components/views/TicketPQRS/CreateTicketPQRS/CreateIndividualCustomerPQRS';
import CreateCorporatePQRS from '../components/views/TicketPQRS/CreateTicketPQRS/CreateCorporatePQRS';
import CreateTicketPQRS from '../components/views/TicketPQRS/CreateTicketPQRS/CreateTicketPQRS';
import FindClientByUpdateData from '../components/views/UpdateDataClient/FindClientByUpdateData';
import VerifyClienteByUpdate from '../components/views/UpdateDataClient/VerifyClienteByUpdate';
import UpdateClientByUpdateData from '../components/views/UpdateDataClient/UpdateClientByUpdateData';

const router = createBrowserRouter(

    createRoutesFromElements(
        <>
            <Route path="/" element={<SelectOptions />} />
            <Route path="/programa-referidos/corredor" element={<SelectOptions />} />
            <Route path="/programa-referidos/corredor/buscar" element={<FindCorredor />} />
            <Route path="/programa-referidos/corredor/crear" element={<CreateindividualCustomer/>} />
            <Route path="/programa-referidos/corredor/crear-corporativo" element={<CreateCorporate/>} />
            <Route path="/programa-referidos/corredor/crear-corporativo-from-refer" element={<CreateCorporateFromRefer/>} />
            <Route path="/programa-referidos/corredor/crear-ticket" element={<TicketInscriptionCorredor/>} />
            <Route path="/programa-referidos/corredor/verificar" element={<VerifyCorredor/>} />
            <Route path="/programa-referidos/corredor/find-corporate" element={<FindCorporate/>} />
            <Route path="/programa-referidos/corredor/referir-corredor" element={<CreateTicketReferirCorporate/>} />
            <Route path="/programa-referidos/pqrs/find-ticket" element={<FindTicketPQRS/>} />
            <Route path="/programa-referidos/pqrs/update-ticket" element={<InfoTicketPQRS/>} />
            <Route path="/programa-referidos/pqrs/find-client" element={<FindClient/>} />
            <Route path="/programa-referidos/pqrs/create-individual-customer-pqrs" element={<CreateIndividualCustomerPQRS/>} />
            <Route path="/programa-referidos/pqrs/create-corporate-pqrs" element={<CreateCorporatePQRS/>} />
            <Route path="/programa-referidos/pqrs/create-ticket-pqrs" element={<CreateTicketPQRS/>} />
            <Route path="/programa-referidos/clientes/find-client-by-update" element={<FindClientByUpdateData/>} />
            <Route path="/programa-referidos/clientes/verify-client-by-update" element={<VerifyClienteByUpdate/>} />
            <Route path="/programa-referidos/clientes/update-client-by-update" element={<UpdateClientByUpdateData/>} />

            {/*<Route path="/programa-referidos/corredor/find/pqrs" element={<FindClient/>} />
            <Route path="/programa-referidos/corredor/crear/pqrs" element={<CreateTiketService/>} />
            <Route path="/programa-referidos/corredor/verify/pqrs" element={<VerifyExistClient/>} /> */}
        </>
    )
);

const AppRoutes = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default AppRoutes