<div className="lg:hidden">
{appointment.map(
  (
    {
      _id,
      doctorPic,
      doctorName,
      doctorType,
      date,
      time,
      problem,
      notes,
      additionalInfo,
      file,
    },
    index
  ) => {
    const isOpen = openIndex === index;

    return (
      <div
        key={doctorName + date}
        className="border-b border-blue-gray-100 p-4"
      >
        {/* Appointment Info Row */}
        <div className="flex items-center">
          {/* Appointment Profile Picture */}
          <div className="flex-shrink-0 w-20 h-20">
            <img
              src={doctorPic}
              alt={doctorName}
              className="h-full w-full rounded-xl bg-light-blue object-cover"
            />
          </div>

          {/* Appointment Info and Appointment Date & Time */}
          <div className="ml-4 flex-1 flex flex-col justify-center">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-medium font-poppins"
            >
              <strong>{doctorName}</strong>
            </Typography>
            <Typography
              color="slate"
              className="font-normal font-poppins text-xs"
            >
              {doctorType}
            </Typography>
            <Typography
              color="slate"
              className="font-normal font-poppins mt-1 text-xs"
            >
              {date} | {time}
            </Typography>
          </div>

          {/* Chat and See More/Less Buttons */}
          <div className="ml-auto flex flex-col space-y-2">
            <Button color="green" size="sm">
              <HiOutlineChatAlt2 className="text-white w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleToggleAccordion(index)}
              color="blue"
              size="sm"
            >
              {isOpen ? (
                <HiOutlineInformationCircle className="text-white w-4 h-4" />
              ) : (
                <HiOutlineInformationCircle className="text-white w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Expandable Additional Info */}
        {isOpen && (
          <div className="mt-4">
            <Accordion open={isOpen}>
              <AccordionBody>
                <div>
                  <div>
                    <strong className="font-bold text-black">
                      Additional Info:
                    </strong>
                    <Typography
                      variant="medium"
                      color="blue-gray"
                      className="font-normal font-poppins"
                    >
                      {additionalInfo}
                    </Typography>
                  </div>
                  <div className="mt-6">
                    <strong className="font-bold text-black">
                      Notes:
                    </strong>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal font-poppins"
                    >
                      {notes}
                    </Typography>
                  </div>
                  <div className="mt-6">
                    <Button
                      className="bg-green-500 text-white rounded-md "
                      size="sm"
                      onClick={() => {
                        console.log("File URL:", file); // Debug: Check if file has a value
                        if (file) {
                          window.open(file, "_blank");
                        } else {
                          alert("No file URL available");
                        }
                      }}
                    >
                      Download File
                    </Button>
                  </div>
                  <div className="mt-6">
                    <Button
                      color="red"
                      size="sm"
                      onClick={() => {
                        handleDelete(_id);
                      }}
                    >
                      Delete Record
                    </Button>
                  </div>
                </div>
              </AccordionBody>
            </Accordion>
          </div>
        )}
      </div>
    );
  }
)}
</div>