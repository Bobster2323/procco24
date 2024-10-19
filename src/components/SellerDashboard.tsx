import React, { useState, useEffect } from 'react';
import { Send, ChevronDown, ChevronUp, AlertCircle, DollarSign, Calendar, MapPin, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Request {
  id: number;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  location: string;
  category: string;
  status: 'open' | 'closed';
}

interface OfferInput {
  price: string;
  comment: string;
}

const SellerDashboard: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null);
  const [offerInputs, setOfferInputs] = useState<{ [key: number]: OfferInput }>({});

  useEffect(() => {
    const storedRequests = localStorage.getItem('serviceRequests');
    if (storedRequests) {
      const parsedRequests = JSON.parse(storedRequests);
      setRequests(parsedRequests);
      const initialOfferInputs = parsedRequests.reduce((acc: { [key: number]: OfferInput }, request: Request) => {
        acc[request.id] = { price: '', comment: '' };
        return acc;
      }, {});
      setOfferInputs(initialOfferInputs);
    }
  }, []);

  const toggleRequestExpansion = (id: number) => {
    setExpandedRequestId(expandedRequestId === id ? null : id);
  };

  const handleOfferInputChange = (requestId: number, field: 'price' | 'comment', value: string) => {
    setOfferInputs(prevInputs => ({
      ...prevInputs,
      [requestId]: {
        ...prevInputs[requestId],
        [field]: value,
      },
    }));
  };

  const handleSubmitOffer = (requestId: number) => {
    const offerInput = offerInputs[requestId];
    const updatedRequests = requests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          offers: [
            ...(request.offers || []),
            {
              id: Date.now(),
              price: parseFloat(offerInput.price),
              comment: offerInput.comment,
              status: 'pending',
            },
          ],
        };
      }
      return request;
    });
    setRequests(updatedRequests);
    localStorage.setItem('serviceRequests', JSON.stringify(updatedRequests));
    
    // Reset the input fields for this specific request
    setOfferInputs(prevInputs => ({
      ...prevInputs,
      [requestId]: { price: '', comment: '' },
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Myyjän Hallintapaneeli</h1>
      {requests.filter(request => request.status === 'open').length === 0 ? (
        <div className="text-center text-gray-600">
          <p>Ei avoimia palvelupyyntöjä tällä hetkellä.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests.filter(request => request.status === 'open').map((request) => (
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
                    <DollarSign className="w-4 h-4 mr-1" />
                    {request.budget}
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {request.deadline}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {request.location}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    Avoin
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Lähetä tarjous</h3>
                  <div className="flex gap-4 mb-2">
                    <input
                      type="number"
                      placeholder="Hinta"
                      value={offerInputs[request.id]?.price || ''}
                      onChange={(e) => handleOfferInputChange(request.id, 'price', e.target.value)}
                      className="flex-1 p-2 border rounded-md"
                    />
                    <button
                      onClick={() => handleSubmitOffer(request.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Lähetä tarjous
                    </button>
                  </div>
                  <textarea
                    placeholder="Lisää kommentti tarjoukseesi..."
                    value={offerInputs[request.id]?.comment || ''}
                    onChange={(e) => handleOfferInputChange(request.id, 'comment', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  ></textarea>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;