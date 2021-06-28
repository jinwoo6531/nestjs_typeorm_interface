<CDataTable
style={{ border: "1px solid red" }}
items={products}
fields={fields}
itemsPerPage={15}
pagination
scopedSlots={{
  "": (item) => (
    <td>
      <CButton color="info" onClick={() => onBtn(item.id)}>
        수정
      </CButton>
    </td>
  ),
}}
/>

<hr />
<hr />
{btnId && (
<CCard>
  <CCollapse show={collapse}>
    <CCardHeader>
      <h1>상품 수정</h1>
    </CCardHeader>
    <CCardBody>
      {/* 상품 수정 */}
      <Descriptions
        bordered
        title="기본정보"
        extra={
          <Button type="primary" onClick={onExited}>
            접기
          </Button>
        }
      >
        <Descriptions.Item
          label="상품 이미지"
          // style={{
          //   display: "flex",
          //   alignItems: "center",
          // }}
        >
          <Dropzone onDrop={dropHandler}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    border: "1px solid lightgray",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <PlusOutlined
                    type="plus"
                    style={{ fontSize: "3rem" }}
                  />
                </div>
              </section>
            )}
          </Dropzone>

          <CImg src={"avatars/7.jpg"} height={100} alt="" />
          <CImg src={"avatars/7.jpg"} height={100} alt="" />
          <CImg src={"avatars/7.jpg"} height={100} alt="" />
          <CImg src={"avatars/7.jpg"} height={100} alt="" />
          <CImg src={"avatars/7.jpg"} height={100} alt="" />
          <CImg src={"avatars/7.jpg"} height={100} alt="" />
        </Descriptions.Item>

        <br />
        <br />

        <Descriptions.Item label="상품명">
          <TextArea
            showCount
            maxLength={30}
            onChange={onChange}
            style={{ width: "50%" }}
          />
        </Descriptions.Item>
        <br />
        <br />
        <Descriptions.Item label="정상 가격">
          <Input style={{ width: "20%" }} defaultValue="60,000" />
          &nbsp;&nbsp;원
        </Descriptions.Item>
        <br />
        <br />
        <Descriptions.Item label="할인 가격">
          <Input style={{ width: "20%" }} defaultValue="60,000" />
          &nbsp;&nbsp;원
        </Descriptions.Item>
        <br />
        <br />

        <Descriptions.Item label="카테고리">
          <Select
            defaultValue="장미"
            style={{ width: 200 }}
            onChange={handleChange}
          >
            <OptGroup label="꽃">
              <Option value="장미">장미</Option>
              <Option value="해바라기">해바라기</Option>
            </OptGroup>
          </Select>
        </Descriptions.Item>
        <br />
        <br />

        <Descriptions.Item label="작품 설명">
          <TextArea
            rows={4}
            showCount
            placeholder="작품 설명 입력"
            maxLength="1000"
            // onChange={onChange}
          />
        </Descriptions.Item>
        <br />
        <br />
        <Descriptions.Item label="수령 방법">
          <Checkbox onChange={onChange}>매장방문</Checkbox>
          <Checkbox onChange={onChange}>퀵 서비스</Checkbox>
        </Descriptions.Item>
        <br />
        <br />
        <Descriptions.Item label="배송 옵션">
          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>퀵 서비스 선택 시에만 적용합니다.</span>
              <Button type="primary" onClick={onAdd}>
                + 옵션 추가
              </Button>
            </div>
          </section>
          <br />
          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>옵션1</span>
              <Input
                style={{ width: "40%" }}
                defaultValue="문래동 관내 배송"
              />
              <span>추가금액</span>
              <Input
                style={{ width: "40%" }}
                defaultValue="5,000"
              />
              <Button type="danger">삭제</Button>
            </div>
          </section>
          <br />
          {num && (
            <section>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>옵션2</span>
                <Input
                  style={{ width: "40%" }}
                  defaultValue="문래동 관내 배송"
                />
                <span>추가금액</span>
                <Input
                  style={{ width: "40%" }}
                  defaultValue="5,000"
                />
                <Button type="danger">삭제</Button>
              </div>
            </section>
          )}
        </Descriptions.Item>
        <br />
        <br />
        <Descriptions.Item label="키워드 등록">
          {/* <Input style={{ width: '20%' }} onPressEnter={handleInputConfirm} /> <Button type="primary">추가</Button><br/> */}
          <EditableTagGroup />
          <br />
          <span style={{ color: "gray", fontSize: "10px" }}>
            띄어쓰기, 문장, 기호, 특수문자를 사용한 등록이
            불가능합니다.
          </span>
        </Descriptions.Item>
      </Descriptions>
      <br />
      <div style={{}}>
        <CButton color="info" className={"mb-1"}>
          취소
        </CButton>
        &nbsp;&nbsp;&nbsp;
        <CButton color="danger" className={"mb-1"}>
          저장
        </CButton>
      </div>
    </CCardBody>
  </CCollapse>
</CCard>
)}