import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import moment from "moment";
import axios from "axios";
import Loader from "../../view/components/Loader";
import Link from "../../view/components/Link";
import Pagination from "../../view/components/Pagination";
import CodeModal from "../../view/components/CodeModal.jsx";

export default function AllCodesPage() {
  const router = useRouter();
  const [currentPage, setPage] = useState(
    Number.parseInt(router.query.page || 1)
  );
  const [pages, setPages] = useState(0);
  const [codes, setCodes] = useState([]);
  const [show, setShow] = useState([!!router.query.item, false]);
  const [item, setItem] = useState({});
  const [confirmRemove, setConfirmRemove] = useState(-1);

  const [loading, setLoading] = useState(false);

  useEffect(
    (e) => {
      async function fetchData() {
        const page = currentPage || 1;

        setLoading(true);
        const result = await axios.get("/api/code/get-all", {
          params: { page },
        });
        if (result.status === 200 && result.data.status) {
          setPages(result.data.pages);
          result.data.data = result.data.data.map((e, i) => {
            e.index = i;
            return e;
          });
          setCodes(result.data.data);
          const selectedItem = !!router.query.item
            ? result.data.data[(Number.parseInt(router.query.item) || 1) - 1]
            : {};
          setShow([!!router.query.item, false]);
          setItem(selectedItem);
        } else {
          toast.error(result.data.message);
        }
        setLoading(false);
      }
      fetchData();
    },
    [currentPage]
  );

  let page = Number.parseInt(router.query.page) || 1;

  function formatDate(d) {
    return (
      d.getDate() +
      "/" +
      (d.getMonth() + 1) +
      "/" +
      d.getFullYear() +
      " at " +
      d.getHours() +
      ":" +
      d.getMinutes()
    );
  }

  function handlePageChange(e) {
    setPage(this);
    router.push({
      query: {
        page: this,
      },
    });
  }

  const handleClose = () => {
    router.push({
      query: {
        page: page,
      },
    });
    setItem({});
  };
  const handleShow = (e) => {
    const item = Number.parseInt(e.target.dataset.item);
    router.push({
      query: {
        page,
        item,
      },
    });
    // setParams({ page, item });
    setShow([true, false]);
    setItem(codes[item - 1]);
  };
  const handleEdit = (e) => {
    const item = Number.parseInt(e.target.dataset.item);
    setShow([true, true]);
    setItem(codes[item - 1]);
  };
  const updateItem = (index, item) => {
    setCodes(
      codes.map((e, i) => {
        if (i != index) return e;
        return item;
      })
    );
  };

  const handleRemove = async (e) => {
    const id = codes[e.target.dataset.item]._id;

    const result = await axios.post("/api/code/delete", {
      id,
    });
    if (result.status == 200 && result.data.status) {
      setCodes(codes.filter((e) => e._id != id));
      setConfirmRemove(-1);
      toast.success(result.data.message);
    } else {
      toast.error(result.data.message);
    }
  };

  return (
    <div className="container">
      <div className="rounded bg-white mt-5 mb-5 container">
        <div className="wrapper p-3 py-5">
          <div className="row mb-3">
            <div className="col">
              <h3>Codes table</h3>
            </div>

            <div className="col">
              <Link to="/code/add">
                <button className="btn btn-primary float-end">+ Add</button>
              </Link>
            </div>
          </div>
          <div className="row">
            {pages > 1 ? (
              <Pagination
                page={page}
                pages={pages}
                onPageChange={handlePageChange}
              />
            ) : (
              ""
            )}
          </div>
          {loading ? <Loader /> : ""}
          {!loading && codes.length == 0 ? (
            <div className="alert alert-primary" role="alert">
              <h4>You haven't add any code yet </h4>
            </div>
          ) : (
            <>
              <table className="table  table-striped">
                <thead>
                  <tr>
                    <th scope="col">#id</th>
                    <th scope="col">Title</th>
                    <th scope="col">Last Update</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((e, i) => {
                    const d = new Date(e["updated_at"]);

                    return (
                      <tr key={i}>
                        <th scope="row">{(page - 1) * 10 + i + 1}</th>
                        <td>
                          <a
                            role={"button"}
                            data-item={i + 1}
                            onClick={handleShow}
                          >
                            {e.title}
                          </a>
                        </td>
                        <td>{moment(d).fromNow()}</td>
                        <td>
                          <Button
                            variant="dark"
                            size="sm"
                            data-item={i + 1}
                            onClick={handleEdit}
                          >
                            Edit
                          </Button>
                          <Button
                            className="ms-3"
                            varient="danger"
                            size="sm"
                            onClick={() => setConfirmRemove(i)}
                          >
                            Remove
                          </Button>
                          <Modal
                            show={confirmRemove == i}
                            backdrop="static"
                            onHide={() => setConfirmRemove(-1)}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title className="h6">
                                Are you sure you want to remove "{e.title}"
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Footer>
                              <Button
                                variant="dark"
                                onClick={() => setConfirmRemove(-1)}
                                size="sm"
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={handleRemove}
                                data-item={i}
                              >
                                Remove
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <CodeModal
                data={item}
                show={show}
                setShow={setShow}
                onSave={updateItem}
                onClose={handleClose}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
