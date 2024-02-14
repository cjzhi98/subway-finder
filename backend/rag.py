from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    ServiceContext,
    StorageContext,
    load_index_from_storage,
)
from llama_index.embeddings import HuggingFaceEmbedding
import os
from dotenv import load_dotenv
from llama_index.llms import Replicate

load_dotenv()

embedding_model = HuggingFaceEmbedding(
    model_name="sentence-transformers/all-MiniLM-L12-v2"
)

llm = Replicate(
    model="mistralai/mistral-7b-instruct-v0.1:5fe0a3d7ac2852264a25279d1dfb798acbc4d49711d126646594e212cb821749"
)

service_context = ServiceContext.from_defaults(llm=llm, embed_model=embedding_model)

PERSIST_DIR = "./storage/"
if not os.path.exists(PERSIST_DIR):
    # load the documents and create the index
    documents = SimpleDirectoryReader("data/").load_data()
    index = VectorStoreIndex.from_documents(
        documents, service_context=service_context, progress=True
    )
    # store it for later
    index.storage_context.persist(persist_dir=PERSIST_DIR)
else:
    # load the existing index
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(
        storage_context, service_context=service_context, progress=True
    )

query_engine = index.as_query_engine()
