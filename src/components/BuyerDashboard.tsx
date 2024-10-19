import React, { useState, useEffect } from 'react';
import { Trash2, MessageSquare, ChevronDown, ChevronUp, DollarSign, Calendar, MapPin, Tag, Check, X, Eye, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Offer {
  id: number;
  price: number;
  comment: string;
  companyId: number;
  status: 'pending' | 'accepted' | 'rejected';
}

interface Request {
  id: number;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  location: string;
  category: string;
  status: 'open' | 'closed';
  offers: Offer[];
}

const BuyerDashboard: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null);
  const [showOffersForRequestId, setShowOffersForRequestId] = useState<number | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const storedRequests = localStorage.getItem('serviceRequests');
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }

    // Simulated company data (in a real app, this would come from a backend)
    const simulatedCompanies: Company[] = [
      { id: 1, name: "TechSolutions Oy", email: "contact@techsolutions.fi", phone: "+358 40 1234567" },
      { id: 2, name: "InnoServices AB", email: "info@innoservices.se", phone: "+358 50 9876543" },
      { id: 3, name: "Nordic Consulting Group", email: "sales@nordicconsulting.fi", phone: "+358 45 1357924" },
    ];
    setCompanies(simulatedCompanies);
  }, []);

  const toggleRequestExpansion = (id: number) => {
    setExpandedRequestId(expandedRequestId === id ? null : id);
  };

  const toggleOffersVisibility = (id: number) => {
    setShowOffersForRequestId(showOffersForRequestId === id ? null : id);
  };

  const deleteRequest = (id: number) => {
    const updatedRequests = requests.filter(request => request.id !== id);
    setRequests(updatedRequests);
    localStorage.setItem('serviceRequests', JSON.stringify(updatedRequests));
  };

  const handleAcceptOffer = (requestId: number, offerId: number) => {
    const updatedRequests = requests.map(request => {
      if (request.id === requestId) {
        const updatedOffers = request.offers.map(offer => ({
          ...offer,
          status: offer.id === offerId ? 'accepted' : 'rejected'
        }));
        return { ...request, offers: updatedOffers, status: 'closed' };
      }
      return request;
    });
    setRequests(updatedRequests);
    localStorage.setItem('serviceRequests', JSON.stringify(updatedRequests));
  };

  const getCompanyDetails = (companyId: number) => {
    return companies.find(company => company.id === companyId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Ostajan Hallintapaneeli</h1>
      {requests.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>Ei palvelupyyntöjä tällä hetkellä.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests.map((request) => (
            <motion.div
              key={request.id}
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {request.category}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{request.title}</h2>
                <p className="text-gray-600 mb-4">
                  {expandedRequestId === request.id
                    ? request.description
                    : `${request.description.slice(0, 100)}...`}
                </p>
                <button
                  onClick={() => toggleRequestExpansion(request.id)}
                  className="text-blue-500 hover:text-blue-700 transition-colors mb-4 flex items-center"
                >
                  {expandedRequestId === request.id ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Näytä vähemmän
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Näytä lisätiedot
                    </>
                  )}
                </button>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {request.budget}
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {request.deadline}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {request.location}
                  </span>
                  <span className={`${request.status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'} px-2 py-1 rounded-md text-xs flex items-center`}>
                    <Tag className="w-3 h-3 mr-1" />
                    {request.status === 'open' ? 'Avoin' : 'Suljettu'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => deleteRequest(request.id)}
                    className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Poista
                  </button>
                  <button 
                    onClick={() => toggleOffersVisibility(request.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {showOffersForRequestId === request.id ? 'Piilota tarjoukset' : 'Näytä tarjoukset'}
                  </button>
                </div>
                <AnimatePresence>
                  {showOffersForRequestId === request.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 border-t pt-4"
                    >
                      <h3 className="font-semibold mb-2">Saadut tarjoukset:</h3>
                      {request.offers && request.offers.length > 0 ? (
                        request.offers.map((offer, index) => (
                          <div key={offer.id} className={`bg-gray-50 p-3 rounded-md mb-2 ${offer.status === 'accepted' ? 'border-2 border-green-500' : ''}`}>
                            <p className="font-medium">Tarjous {index + 1}</p>
                            <p>Hinta: {offer.price} €</p>
                            <p>Kommentti: {offer.comment}</p>
                            {offer.status === 'pending' && request.status === 'open' && (
                              <div className="mt-2">
                                <button
                                  onClick={() => handleAcceptOffer(request.id, offer.id)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors"
                                >
                                  <ThumbsUp className="w-4 h-4 mr-2" />
                                  Hyväksy tarjous
                                </button>
                              </div>
                            )}
                            {offer.status === 'accepted' && (
                              <div className="mt-2">
                                <p className="text-green-600 font-semibold flex items-center">
                                  <Check className="w-4 h-4 mr-1" />
                                  Hyväksytty tarjous
                                </p>
                                {getCompanyDetails(offer.companyId) && (
                                  <div className="mt-2 p-2 bg-green-100 rounded-md">
                                    <h4 className="font-semibold">Yrityksen tiedot:</h4>
                                    <p>{getCompanyDetails(offer.companyId)?.name}</p>
                                    <p>{getCompanyDetails(offer.companyId)?.email}</p>
                                    <p>{getCompanyDetails(offer.companyId)?.phone}</p>
                                  </div>
                                )}
                              </div>
                            )}
                            {offer.status === 'rejected' && (
                              <p className="text-red-600 mt-2 flex items-center">
                                <X className="w-4 h-4 mr-1" />
                                Hylätty tarjous
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p>Ei vielä tarjouksia tälle pyynnölle.</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;